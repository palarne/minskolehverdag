import express from "express";
import cors from "cors";
import {Resend} from "resend";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/data", express.static("data"));

const resend = new Resend(
    process.env.RESEND_API_KEY
);

app.post("/submit", async (req, res) => {

    try {

        const json =
            JSON.stringify(
                req.body,
                null,
                2
            );

        await resend.emails.send({

            from:
                "onboarding@resend.dev",

            to:
                "pal.rosdal@gmail.com",

            subject:
                `Survey ${req.body.kandidatnummer}`,

            text:
                "Survey attached.",

            attachments: [
                {
                    filename:
                        `survey-${req.body.kandidatnummer}.json`,

                    content:
                        Buffer
                            .from(json)
                            .toString("base64")
                }
            ]
        });

        res.json({
            ok: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            error:
            error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server kjører");
});
