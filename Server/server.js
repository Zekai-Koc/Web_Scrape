import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as cheerio from "cheerio";
import axios from "axios";

const app = express();
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

const port = process.env.PORT || 7000;

app.listen(port, () => console.log(`Listening on port: ${port}`));

app.get("/", (req, res) => {
   res.send("Hello World!");
});

app.post("/", async (req, res) => {
   const { url } = req.body;
   console.log(url);

   // const { data: html } = await axios.get(url);
   // const $ = cheerio.load(html);

   const $ = cheerio.load(
      "C:/Users/zek/Desktop/MyProjects/Web_Scrape/data/dummy.html"
   );

   const scrapedData = $("title").text();

   console.log($.root().html());

   console.log("title ==>> ", scrapedData);
   res.json(scrapedData);
});
