import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv'
dotenv.config()

//upserts the professor review into the database

export async function POST(req){
    try { 
        const pc = new Pinecone({apiKey:process.env.PINECONE_API_KEY})
        const data = await req.json()
        const professor = data.professor
        const professor_embed = data.professor_embed
        // const professor = data.professor   
    
        // const response = await openai.embeddings.create({
        //     input: profToMessage(professor),
        //     model: "text-embedding-3-small",
        // })
        const vector = professor_embed.data[0].embedding

        const pc_data = {
            "values":vector,
            "id":professor.name,
            "metadata":{
                "name":professor.name,
                "department":professor.department,
                "courses":professor.courses,
                "ratings":professor.ratings,
                "reviews":professor.reviews
            }
        }

        const indices = await pc.listIndexes()
        if (!indices.indexes.find( index=>index.name === "scraper")){
            return NextResponse.json({data:"index not found"})
        }
        const index = pc.index("scraper")

        const id = pc_data.id
        const fetched = await index.fetch([id]) 
        if (!fetched.records.id){
            await index.upsert([pc_data])
            return NextResponse.json({data:`success`})
        } else {
            return NextResponse.json({data:fetched})
        }
    } catch (error){
        return NextResponse.json({data:error.message})
    }
}

// function profToMessage(professor){
//     const {name, department, courses, ratings, reviews} = professor
//     let result = `${name} is a professor in the ${department} and teaches the following courses:`
//     courses.forEach(course => {
//         result +=`${course}`
//     });
//     result += `. Here are previous student reviews:`
//     reviews.forEach((review, i) => {
//         result += ` "${review}", rating: ${ratings[i]}/5;`
//     })
//     return result
// }


