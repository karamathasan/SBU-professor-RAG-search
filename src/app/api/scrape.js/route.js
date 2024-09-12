import cheerio from 'cheerio';

export async function GET(req) {
    const data = await req.json()
    const source = data.source //link to page being scraped
    try {
        const { data } = await fetch('https://example.com');
        const $ = cheerio.load(data);
        const scrapedData = $('selector').text(); // Modify to select the data you need

        res.status(200).json({ data: scrapedData }); // or { data: results }
    } catch (error) {
        res.status(500).json({ error: 'Error scraping data' });
    }
}

function clean(text){

}