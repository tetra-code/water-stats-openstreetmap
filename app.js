const express = require('express');
const ws = require("ws")
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const puppeteer = require('puppeteer');

const cities = ['alkmaar', 'almere', 'amersfoort', 'amstelveen', 'amsterdam-nl', 'apeldoorn', 
    'arnhem', 'assen', 'breda', 'delft', 's-hertogenbosch', 'the-hague-den-haag', 'den-helder',
    'deventer', 'doorn', 'dordrecht', 'edam', 'ede', 'eindhoven', 'enkhuizen', 'enschede', 'giethoorn',
    'gouda', 'haarlem', 'heerlen', 'hilversum', 'hoorn', 'kampen', 'kinderdijk', 'leeuwarden',
    'leiden', 'lelystad', 'maastricht', 'medemblik', 'nijmegen', 'roermond', 'rotterdam', 'sneek',
    'tilburg', 'utrecht', 'veere', 'venlo', 'wageningen', 'zaanse-schans', 'zwolle'];

let waterData = {};

async function scrapeProduct() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    let items;
    for (let i = 0; i<cities.length; i++) {
        const url = `https://www.tapsafe.org/is-${cities[i]}-tap-water-safe-to-drink/`;
        try {
            await page.goto(url);
            await page.waitForSelector('.water-quality-graph__bar');
            items = await page.$$eval('.water-quality-graph__bar', itemElements => itemElements.map(i => i.innerText.trim()));
        } catch (e) {
            items = 'unknown';
        }
        waterData[cities[i]] = items;
    }
    browser.close();
};

// scrapeProduct();

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`, {
    extensions:['html']
}));

app.get('/', (req, res) => {
    res.render("splash");
})

const server = http.createServer(app);
const wss = new ws.Server({ server });

wss.on("connection", (con) => {
    con.on("message", async (request) => {
      const city = JSON.parse(request)
      con.send(JSON.stringify(waterData[city]));
      console.log('sending mesage')
    });
  
    con.on("close", () => {
    })
});

server.listen(port, ()=>{
    console.log(`Server conected to port ${port}`);
});
