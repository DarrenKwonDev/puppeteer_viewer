const puppeteer = require("puppeteer");
const express = require("express");
const r = require("@mozilla/readability");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();

app.get("/", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      res.type("text/html");
      return res.end("You need to specify <code>url</code> query parameter");
    }
    // const url = 'https://namu.wiki/w/%EB%8C%80%EC%A0%84%EC%9A%B4%EC%88%98'

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const start = new Date(); // for time check

    page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
    });
    await page.goto(url);

    const body = await page.evaluate(() => {
      return document.querySelector("body").innerHTML;
    });
    const end = new Date(); // for time check

    const { document } = new JSDOM(body).window;

    var article = new r.Readability(document).parse();

    console.log(`took ${(end - start) / 1000} seconds`);

    res.status(200).send(article.content);
    // await browser.close()
  } catch (error) {
    console.log(error.message);
    return res.status(500).send();
  }
});
app.listen(9999);
console.log("listening on 9999");
