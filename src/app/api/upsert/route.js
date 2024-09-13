import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv'
dotenv.config()

//upserts the professor review into the database
export async function POST(req){
    try { 
        const pc = new Pinecone({apiKey:process.env.PINECONE_API_KEY})
        const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})
        const data = await req.json()
        const professor = data.professor
    
        const response = await openai.embeddings.create({
            input:professor,
            model: "text-embedding-3-small",
        })
        const embedding = response.data[0].embedding
        const pc_data = {
            "values":embedding,
            "id":professor.name,
            "metadeta":{
                "name":professor.name,
                "department":professor.department,
                "courses":professor.courses,
                "reviews":professor.reivews
            }
        }
        
        const index = pc.Index('professors')
        //TODO: check if the data for a professor already exists
        if (!index.fetch([pc_data.id])){
            index.upsert([pc_data])
            return NextResponse.json({data:"success"})
        } else {
            return NextResponse.json({data:"failure, attempted to add existing professor review"})
        }
    } catch (error){
        return NextResponse.json({data:error.message})
    }
}


