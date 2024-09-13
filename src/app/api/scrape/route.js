import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

/**
 * professor object:
 * name:
 * subjects:[]
 * reviews:[{
 *   rating:
 *   message: 
 * }]
 */
function parseRMP(html){
    const $ = cheerio.load(html)
    const firstName = $("div:first > div:first > div:first > div:eq(2) > div:eq(1) > div:first > div:eq(1) > div:first > span:first").text()
    const lastName = $("div:first > div:first > div:first > div:eq(2) > div:eq(1) > div:first > div:eq(1) > div:first > span:last").text()
    const name = firstName + " " + lastName
    let reviews = []
    $('div:first > div:first > div:first > div:eq(2) > div:eq(3) > div:first > div:first > ul > li').each((i, element)=>{
        const $elem = $(element)
        const rating = $elem.find('div:first > div:first > div:eq(1) > div:first > div:first > div:eq(1)').text()
        const message = $elem.find('div:first > div:first > div:eq(2) > div:eq(2)').text() 
        if (message){
            reviews.push({
                rating:rating,
                message:message
            })
        }
    })
    return {
        name : name,
        reviews: reviews
    }
}

export async function POST(req) {
    const data = await req.json()
    const source = data.source //link to page being scraped
    try {
        const res = await fetch(source);
        const html = await res.text()

        let scrapedData
        if (source.includes("https://www.ratemyprofessors.com/")){
            scrapedData = parseRMP(html)
        } else {
            const $ = cheerio.load(html);
            scrapedData = $('div').text()
        }
        console.log(scrapedData)
        return NextResponse.json({ data: scrapedData});
    } catch (error) {
        return NextResponse.json({ data: error.message });
    }
}
