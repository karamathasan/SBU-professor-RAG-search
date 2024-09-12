import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const data = await req.json()
    const source = data.source //link to page being scraped
    try {
        const { data } = await fetch(source);
        const $ = cheerio.load(data);
        const scrapedData = $('p').text();

        return NextResponse.json({ data: scrapedData});
    } catch (error) {
        return NextResponse.json({ data: error.message });
    }
}
