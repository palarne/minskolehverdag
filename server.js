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

app.get("/email-test", async (req, res) => {

    try {

        console.log("Testing email");

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.EMAIL_TO,
            subject: "Test",
            text: "Hello"
        });

        console.log("Email sent");

        res.send("Email sent");

    } catch (error) {

        console.error("EMAIL TEST FAILED");
        console.error(error);

        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server kjører");
});
