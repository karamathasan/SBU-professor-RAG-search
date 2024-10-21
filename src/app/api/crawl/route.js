import puppeteer from "puppeteer"
import { NextResponse } from "next/server"

// to avoid excessive api request time, we can race this request or make it return an array of links to be searched
// puppeteer can be used to click things while cheerio can't
export async function GET(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto("https://www.ratemyprofessors.com/search/professors/971?q=*")

    // should keep clicking while there are professors
    // while (page.locator(".Buttons__Button-sc-19xdot-1 PaginationButton__StyledPaginationButton-txi1dr-1 glImpo")){
        // professors.push( )
    // await page.locator(".Buttons__Button-sc-19xdot-1 PaginationButton__StyledPaginationButton-txi1dr-1 glImpo").click()
    // }
    const professors = await page.$$eval(".TeacherCard__StyledTeacherCard-syjs0d-0 dLJIlx", profiles => profiles.map(profile => profile.innerHTML))
    // const professors = await page.$$eval(".TeacherCard__StyledTeacherCard-syjs0d-0 dLJIlx", profiles => profiles.map(profile => profile.href))

    console.log(professors)
    // const content = await page.content()
    // console.log(content.toString())
    await browser.close()
    return NextResponse.json({data:professors})
}