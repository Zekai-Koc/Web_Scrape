import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

const port = process.env.PORT || 7000;

app.listen(port, () => console.log(`Listening on port: ${port}`));

app.get("/", (req, res) => {
   res.send("Hello World!");
});

app.post("/", (req, res) => {
   console.log(req.body);
   res.send(req.body);
});
