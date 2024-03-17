const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const replace = require("absolutify");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.send("Not url found");
  } else {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(`https://${url}`);

      let document = await page.evaluate(
        () => document.documentElement.outerHTML
      );

      document = replace(document, `/proxy?url=${url.split("/")[0]}`);

      await browser.close();

      return res.send(document);
    } catch (e) {
      console.log(e);
      return res.send(e);
    }
  }
});

app.listen(3000, () => console.log(`Server listening on port 3000`));
