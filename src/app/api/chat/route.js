import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import dotenv from 'dotenv'

export async function POST(req) {
    const data = await req.json()
    const text = data.text

    const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

    const pc = new Pinecone({apiKey:process.env.PINECONE_API_KEY})
    const index = pc.index('professors')

    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      })

    // const res = await index.upsert()
}