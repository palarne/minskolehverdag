import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/data", express.static("data"));

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
app.post("/api/submit", async (req, res) => {
  const entry = {
    time: new Date(),
    data: req.body
  };

  fs.appendFileSync("responses.json", JSON.stringify(entry) + "\n");

  // EMAIL SETUP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "sandra.samuelsen@osloskolen.no",
    subject: "Nytt skjema - Min skolehverdag",
    text: JSON.stringify(entry, null, 2)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-post sendt!");
  } catch (err) {
    console.log("E-post feilet:", err);
  }

  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Server kjører");
});
