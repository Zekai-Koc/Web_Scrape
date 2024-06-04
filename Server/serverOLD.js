const cors = require("cors");

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const app = express();
const PORT = 3000;
app.use(cors());

app.use(express.json());

app.post("/api/scrape", async (req, res) => {
   const { url } = req.body;

   try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Burada scraping işlemini yapın
      const scrapedData = $("title").text(); // Örneğin sayfa başlığını alalım

      // PDF oluşturma
      const pdfPath = "output.pdf";
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(12).text(scrapedData, {
         align: "center",
      });
      doc.end();

      res.json({ pdfLink: pdfPath });
   } catch (error) {
      res.status(500).json({
         error: "Scraping veya PDF oluşturma işlemi sırasında bir hata oluştu.",
      });
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
