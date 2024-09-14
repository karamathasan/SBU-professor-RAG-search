import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

/**
 * professor object:
 * name:
 * department:
 * courses:[]
 * 
 * //these two are indexed together
 * rating:[]
 * reviews:[]
 * }]
 */
function parseRMP(html){
    const $ = cheerio.load(html)
    const firstName = $("div:first > div:first > div:first > div:eq(2) > div:eq(1) > div:first > div:eq(1) > div:first > span:first").text()
    const lastName = $("div:first > div:first > div:first > div:eq(2) > div:eq(1) > div:first > div:eq(1) > div:first > span:last").text()
    const department = $("div:first > div:first > div:first > div:eq(2) > div:eq(1) > div:first > div:eq(1) > div:eq(1) > span > a > b").text()
    const name = firstName + " " + lastName
    let ratings = []
    let reviews = []
    let courses = []
    $('div:first > div:first > div:first > div:eq(2) > div:eq(3) > div:first > div:first > ul > li').each((i, element)=>{
        const $elem = $(element)
        const rating = $elem.find('div:first > div:first > div:eq(1) > div:first > div:first > div:eq(1)').text()
        const review = $elem.find('div:first > div:first > div:eq(2) > div:eq(2)').text() 
        if (review){ //checking if there is an ad
            ratings.push(rating)
            reviews.push(review)
            const course = $elem.find('div:first > div:first > div:eq(2) > div:first > div:first > div:first').text()
            if (!courses.includes(course)){
                courses.push(course)
            }
        }
    })
    return {
        name : name,
        department: department,
        courses: courses,
        ratings: ratings,
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
            return NextResponse.json({message:"not from ratemyprofessors.com"})
        }
        return NextResponse.json({ data: scrapedData});
    } catch (error) {
        return NextResponse.json({ data: error.message });
    }
}
