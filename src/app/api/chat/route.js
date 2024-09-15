import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import dotenv from 'dotenv'
dotenv.config()
const systemPrompt=`
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.

Make sure to:
- Make objective claims.
- Never make negative or potentially rude comments about professors.
- Answer concisely. Do not answer with multiple professors when unnecessary.

When making recommendations, be sure to account for:
- Course relevance and the professor's area of specialization.
- Past student reviews or ratings (although there is no need to explicitly state the professors ratings).
- The professor's teaching methodology and experience level.
`

export async function POST(req) {
    const data = await req.json()
    const messages = data.messages

    const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

    const pc = new Pinecone({apiKey:process.env.PINECONE_API_KEY})
    const index = pc.index('scraper')

    let latest = messages.pop().content

    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: latest,
        encoding_format: 'float',
      })

    const results = await index.query({
      topK:3,
      vector:embedding.data[0].embedding,
      includeMetadata:true
    })

    //TODO: prevent this message from becoming too long
    let context = ''
    results.matches.forEach((match)=>{
      context +=`
      \n\n
      Professor: ${match.id}
      Department: ${match.metadata.department}
      Courses: ${match.metadata.courses}
      Ratings: ${match.metadata.ratings}
      Reviews: ${match.metadata.reviews}      
      `
    })

    latest += context
    const completion = await openai.chat.completions.create({
      messages:[
        {role:"system",content:systemPrompt},
        ...messages,
        {role:"user",content:latest}
      ],
      model: "gpt-4",
      stream: false
    })
    const chatResponse = completion.choices[0].message.content
    console.log(chatResponse)
    return NextResponse.json({data:chatResponse})
}