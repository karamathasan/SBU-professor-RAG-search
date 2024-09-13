import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import dotenv from 'dotenv'
dotenv.config()
const systemPrompt=`

`

export async function POST(req) {
    const data = await req.json()
    const messages = data.messages

    const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

    const pc = new Pinecone({apiKey:process.env.PINECONE_API_KEY})
    const index = pc.index('professors')

    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      })

    const results = await index.query({
      topK:3,
      vector:embedding.data[0].embedding,
    })

    let context = ''
    results.matches.forEach((match)=>{
      context +=`
      \n\n
      Professor: ${match.id}
      Department: ${match.metadata.department}
      Courses: ${match.metadata.courses}
      Reviews: ${match.metadata.reviews}
      `
    })
    const latest = messages.pop().content
    latest.join(context)

    const completion = openai.completions.create({
      messages:[
        {role:"system",content:systemPrompt},
        messages,
        {role:"user",context:latest}
      ],
      model: "gpt-3.5-turbo-instruct",
      stream: false
    })
}