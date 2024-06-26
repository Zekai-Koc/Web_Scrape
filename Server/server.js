import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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

   try {
      let html;
      if (url.startsWith("http") || url.startsWith("https")) {
         const response = await axios.get(url);
         html = response.data;
      } else {
         const filePath = path.resolve(url);
         html = fs.readFileSync(filePath, "utf-8");
      }

      const $ = cheerio.load(html);

      // Extract address lines
      const addressLines = [];
      $(".address-lines .line").each((index, element) => {
         addressLines.push($(element).text().trim());
      });

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 200]); // Adjust page size to fit label dimensions

      // Set font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.setFont(font);

      // Set font size and line height for the address lines
      const fontSize = 12;
      const lineHeight = fontSize * 1.2;

      // Set starting y position for the address lines
      let yPosition = page.getHeight() - fontSize - 10; // Leave some space from the bottom

      // Add the address lines to the PDF
      addressLines.forEach((line) => {
         page.drawText(line, {
            x: 50,
            y: yPosition,
            size: fontSize,
            color: rgb(0, 0, 0),
         });
         yPosition -= lineHeight; // Move to the next line
      });

      // Serialize the PDF document to bytes
      const pdfBytes = await pdfDoc.save();

      // Set the response type and send the PDF bytes
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
         "Content-Disposition",
         "attachment; filename=address_label.pdf"
      );
      res.send(Buffer.from(pdfBytes));
   } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
   }
});

// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// import * as cheerio from "cheerio";
// import axios from "axios";
// import fs from "fs";
// import path from "path";
// import { PDFDocument, rgb } from "pdf-lib";

// const app = express();
// app.use(cors());

// app.use(morgan("dev"));
// app.use(express.json());

// const port = process.env.PORT || 7000;

// app.listen(port, () => console.log(`Listening on port: ${port}`));

// app.get("/", (req, res) => {
//    res.send("Hello World!");
// });

// app.post("/", async (req, res) => {
//    const { url } = req.body;
//    console.log(url);

//    try {
//       let html;
//       if (url.startsWith("http") || url.startsWith("https")) {
//          const response = await axios.get(url);
//          html = response.data;
//       } else {
//          const filePath = path.resolve(url);
//          html = fs.readFileSync(filePath, "utf-8");
//       }

//       const $ = cheerio.load(html);

//       const addressLines = [];
//       $(".address-lines .line").each((index, element) => {
//          addressLines.push($(element).text().trim());
//       });

//       // Create a new PDF document
//       const pdfDoc = await PDFDocument.create();
//       const page = pdfDoc.addPage();
//       const { width, height } = page.getSize();

//       // Add the address lines to the PDF
//       const fontSize = 12;
//       let yPosition = height - fontSize * 2;
//       page.drawText("Address:", {
//          x: 50,
//          y: yPosition,
//          size: fontSize,
//          color: rgb(0, 0, 0),
//       });
//       yPosition -= fontSize * 2;

//       addressLines.forEach((line) => {
//          page.drawText(line, {
//             x: 50,
//             y: yPosition,
//             size: fontSize,
//             color: rgb(0, 0, 0),
//          });
//          yPosition -= fontSize * 1.5;
//       });

//       // Serialize the PDF document to bytes
//       const pdfBytes = await pdfDoc.save();

//       // Set the response type and send the PDF bytes
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=address.pdf");
//       res.send(Buffer.from(pdfBytes));
//    } catch (error) {
//       console.error("Error:", error.message);
//       res.status(500).json({ error: error.message });
//    }
// });

// // import express from "express";
// // import morgan from "morgan";
// // import cors from "cors";
// // import * as cheerio from "cheerio";
// // import axios from "axios";
// // import fs from "fs";
// // import path from "path";
// // import { PDFDocument, rgb } from "pdf-lib";

// // const app = express();
// // app.use(cors());

// // app.use(morgan("dev"));
// // app.use(express.json());

// // const port = process.env.PORT || 7000;

// // app.listen(port, () => console.log(`Listening on port: ${port}`));

// // app.get("/", (req, res) => {
// //    res.send("Hello World!");
// // });

// // app.post("/", async (req, res) => {
// //    const { url } = req.body;
// //    console.log(url);

// //    try {
// //       let html;
// //       if (url.startsWith("http") || url.startsWith("https")) {
// //          const response = await axios.get(url);
// //          html = response.data;
// //       } else {
// //          const filePath = path.resolve(url);
// //          html = fs.readFileSync(filePath, "utf-8");
// //       }

// //       const $ = cheerio.load(html);

// //       const addressLines = [];
// //       $(".address-lines .line").each((index, element) => {
// //          addressLines.push($(element).text().trim());
// //       });

// //       // Create a new PDF document
// //       const pdfDoc = await PDFDocument.create();
// //       const page = pdfDoc.addPage();
// //       const { width, height } = page.getSize();

// //       // Add the address lines to the PDF
// //       const fontSize = 12;
// //       let yPosition = height - fontSize * 2;
// //       page.drawText("Address:", {
// //          x: 50,
// //          y: yPosition,
// //          size: fontSize,
// //          color: rgb(0, 0, 0),
// //       });
// //       yPosition -= fontSize * 2;

// //       addressLines.forEach((line) => {
// //          page.drawText(line, {
// //             x: 50,
// //             y: yPosition,
// //             size: fontSize,
// //             color: rgb(0, 0, 0),
// //          });
// //          yPosition -= fontSize * 1.5;
// //       });

// //       // Serialize the PDF document to bytes
// //       const pdfBytes = await pdfDoc.save();

// //       // Set the response type and send the PDF bytes
// //       res.setHeader("Content-Type", "application/pdf");
// //       res.setHeader("Content-Disposition", "attachment; filename=address.pdf");
// //       res.send(Buffer.from(pdfBytes));
// //    } catch (error) {
// //       console.error("Error:", error.message);
// //       res.status(500).json({ error: error.message });
// //    }
// // });

// // // import express from "express";
// // // import morgan from "morgan";
// // // import cors from "cors";
// // // import * as cheerio from "cheerio";
// // // import axios from "axios";
// // // import fs from "fs";
// // // import path from "path";
// // // import { PDFDocument, rgb } from "pdf-lib";

// // // const app = express();
// // // app.use(cors());

// // // app.use(morgan("dev"));
// // // app.use(express.json());

// // // const port = process.env.PORT || 7000;

// // // app.listen(port, () => console.log(`Listening on port: ${port}`));

// // // app.get("/", (req, res) => {
// // //    res.send("Hello World!");
// // // });

// // // app.post("/", async (req, res) => {
// // //    const { url } = req.body;
// // //    console.log(url);
