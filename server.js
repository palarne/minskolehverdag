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

    try {

        const surveyResponse = req.body;

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.EMAIL_TO,
            subject: `Survey response ${surveyResponse.kandidatnummer}`,
            text: JSON.stringify(
                surveyResponse,
                null,
                2
            )
        });

        console.log("Survey response emailed");

        res.json({
            ok: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server kjører");
});
