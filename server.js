// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Random ID generator for notes
// =============================================================

const generateId = () => {
  let characters = "1234567890qwertyuiopasdfghjklzxcvbnm";
  let id = "";
  for (let i = 0; i < 8; i++) {
    let index = Math.floor(Math.random() * characters.length);
    id += characters[index];
  }
  return id;
};

// Routes
// =============================================================

// Note page route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// API routes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    console.log(JSON.parse(data));
    res.json(data);
  });
});

app.get("/api/notes/:id", function (req, res) {
  const id = req.params.id;
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    let notes = JSON.parse(data);
    for (const note of notes) {
      if (note.id == id) {
        console.log(note);
        return res.json(note);
      }
    }
    return res.json(false);
  });
});

app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  newNote.id = generateId();
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    let notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(notes),
      "utf8",
      (err) => {
        if (err) throw err;
        console.log("The file has been saved with the new note.");
        res.send(true);
      }
    );
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    let notes = JSON.parse(data);
    for (const note of notes) {
      if (note.id == id) {
        notes.splice(notes.indexOf(note), 1);
        fs.writeFile(
          path.join(__dirname, "db/db.json"),
          JSON.stringify(notes),
          "utf8",
          (err) => {
            if (err) throw err;
            console.log("The file has been saved with the requested deletion.");
          }
        );

        return res.send(true);
      }
    }
    return res.json(false);
  });
});

// Default page route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
