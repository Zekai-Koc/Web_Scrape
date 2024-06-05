// // const express = require("express");

// // const app = express();
// // const PORT = 3000;

// // app.use(express.json());

// // app.listen(PORT, () => {
// //    console.log(`Server is running on http://localhost:${PORT}`);
// // });

// // app.get("/api/scrape", (req, res) => {
// //    res.send("Hello World");
// // });

// // app.post("/api/scrape", async (req, res) => {
// //    const { url } = req.body;

// //    console.log(url);

// //    try {
// //       const response = await axios.get(url);
// //       const $ = cheerio.load(response.data);

// //       const scrapedData = $("title").text();

// //       console.log(scrapedData);

// //       // PDF oluşturma
// //       // const pdfPath = "output.pdf";
// //       // const doc = new PDFDocument();
// //       // doc.pipe(fs.createWriteStream(pdfPath));
// //       // doc.fontSize(12).text(scrapedData, {
// //       //    align: "center",
// //       // });
// //       // doc.end();

// //       // res.json({ pdfLink: pdfPath });
// //    } catch (error) {
// //       res.status(500).json({
// //          error: "Error scraping data.",
// //       });
// //    }
// // });

// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const cors = require("cors"); // Ensure CORS is enabled for cross-origin requests

// const app = express();
// const PORT = 7000;

// // Middleware to parse JSON requests
// app.use(express.json());
// app.use(cors());

// app.post("/api/scrape", async (req, res) => {
//    const { url } = req.body;

//    console.log(`Received URL: ${url}`);

//    try {
//       const response = await axios.get(url);
//       const $ = cheerio.load(response.data);

//       const scrapedData = $("title").text();

//       console.log(`Scraped Data: ${scrapedData}`);

//       // PDF creation (commented out for now)
//       // const pdfPath = "output.pdf";
//       // const doc = new PDFDocument();
//       // doc.pipe(fs.createWriteStream(pdfPath));
//       // doc.fontSize(12).text(scrapedData, {
//       //    align: "center",
//       // });
//       // doc.end();

//       res.json({ scrapedData });
//    } catch (error) {
//       console.error(`Error scraping data: ${error.message}`);
//       res.status(500).json({
//          error: "Error scraping data.",
//       });
//    }
// });

// app.listen(PORT, () => {
//    console.log(`Server is running on http://localhost:${PORT}`);
// });

// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const cors = require("cors");

// const app = express();
// const PORT = 3000;

// // Middleware to parse JSON requests
// app.use(express.json());
// app.use(cors());

// app.post("/api/scrape", async (req, res) => {
//    const { url } = req.body;

//    console.log(`Received URL: ${url}`);

//    try {
//       const response = await axios.get(url);

//       // Check if the response content type is HTML
//       if (response.headers["content-type"].includes("text/html")) {
//          const $ = cheerio.load(response.data);
//          const scrapedData = $("title").text();

//          console.log(`Scraped Data: ${scrapedData}`);

//          // Send the scraped data back as JSON
//          res.json({ scrapedData });
//       } else {
//          throw new Error("The URL did not return an HTML page");
//       }
//    } catch (error) {
//       console.error(`Error scraping data: ${error.message}`);
//       res.status(500).json({
//          error: "Error scraping data.",
//          details: error.message,
//       });
//    }
// });

// app.listen(PORT, () => {
//    console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const helmet = require("helmet"); // Import helmet

const app = express();
const PORT = 7000;

// Use helmet for security headers
app.use(helmet());

app.use(
   helmet.contentSecurityPolicy({
      directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "blob:"], // Allow scripts from 'self' and 'blob:'
         objectSrc: ["'none'"],
         upgradeInsecureRequests: [],
      },
   })
);

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

app.post("/api/scrape", async (req, res) => {
   const { url } = req.body;

   console.log(`Received URL: ${url}`);

   try {
      const response = await axios.get(url);

      // Check if the response content type is HTML
      if (response.headers["content-type"].includes("text/html")) {
         const $ = cheerio.load(response.data);
         const scrapedData = $("title").text();

         console.log(`Scraped Data: ${scrapedData}`);

         // Send the scraped data back as JSON
         res.json({
            pdfLink: `/api/download?data=${encodeURIComponent(scrapedData)}`,
         });
      } else {
         throw new Error("The URL did not return an HTML page");
      }
   } catch (error) {
      console.error(`Error scraping data: ${error.message}`);
      res.status(500).json({
         error: "Error scraping data.",
         details: error.message,
      });
   }
});

app.get("/api/download", (req, res) => {
   const { data } = req.query;

   // Create a PDF document
   const PDFDocument = require("pdfkit");
   const doc = new PDFDocument();
   const buffers = [];

   doc.on("data", buffers.push.bind(buffers));
   doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
         "Content-Type": "application/pdf",
         "Content-Disposition": "attachment;filename=output.pdf",
         "Content-Length": pdfData.length,
      }).send(pdfData);
   });

   doc.fontSize(12).text(data, {
      align: "center",
   });
   doc.end();
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
