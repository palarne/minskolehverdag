import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/data", express.static("data"));

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

app.post("/submit", async (req, res) => {

    console.log("SUBMIT RECEIVED");

    res.json({
        ok: true
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server kjører");
});
