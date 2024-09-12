import cheerio from 'cheerio';

export async function GET(req) {
    const data = await req.json()
    const source = data.source //link to page being scraped
    try {
        const { data } = await fetch(source);
        const $ = cheerio.load(data);
        const scrapedData = $('p').text();

        res.status(200).json({ data: scrapedData });
    } catch (error) {
        res.status(500).json({ error: 'Error scraping data' });
    }
}

function clean(text){

}