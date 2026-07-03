import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Hent skjema
app.get("/api/survey/:type", (req, res) => {
  const type = req.params.type;
  const file = `./data/${type}.json`;

  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: "Fant ikke skjema" });
  }

  const data = JSON.parse(fs.readFileSync(file));
  res.json(data);
});

// Lagre svar
app.post("/api/submit", (req, res) => {
  const entry = {
    time: new Date(),
    data: req.body
  };

  fs.appendFileSync("responses.json", JSON.stringify(entry) + "\n");

  // enkel e-post-løsning (Render støtter dette via SMTP)
  console.log("NYTT SKJEMA SENDT:", entry);

  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Server kjører");
});
