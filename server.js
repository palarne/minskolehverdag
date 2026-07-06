import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const db = new sqlite3.Database("./db.sqlite");

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/data", express.static("data"));

db.run(`
CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participantId TEXT,
  mode TEXT,
  answers TEXT
)
`);

app.post("/submit", (req, res) => {

  const { participantId, mode, answers } = req.body;

  db.run(
    "INSERT INTO responses (participantId, mode, answers) VALUES (?,?,?)",
    [
      participantId,
      mode,
      JSON.stringify(answers)
    ]
  );

  res.json({ ok: true });

});

app.get("/responses", (req, res) => {

  db.all(
    "SELECT * FROM responses",
    (err, rows) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(rows);
    }
  );

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server kjører");
});
