import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/data", express.static("data"));

const resend = new Resend(
    process.env.RESEND_API_KEY
);

app.get("/email-test", async (req, res) => {

    try {

        const result =
            await resend.emails.send({

                from:
                    "onboarding@resend.dev",

                to:
                    "pal.arne.rosdal@tieto.com",

                subject:
                    "Survey test",

                text:
                    "Hello from MinSkolehverdag"

            });

        console.log(result);

        res.send("Email sent");

    } catch (error) {

        console.error(error);

        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server kjører");
});
