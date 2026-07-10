import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/data", express.static("data"));

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
