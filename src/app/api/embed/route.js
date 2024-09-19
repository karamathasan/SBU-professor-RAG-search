import OpenAI from "openai";
import { NextResponse } from "next/server";
import dotenv from 'dotenv'
dotenv.config()

// embed input text to vector
export async function POST(req) {
    const data = await req.json()
    const text = data.text
    const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      })

    return NextResponse.json({data:embedding})
}