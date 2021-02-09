//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const savedNotes = require("./db/db.json");

//Setup Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Static route that sends user to index.html
app.use(express.static(path.join(__dirname, "public")));


//Inital Routes
app.get("/", (req,res) => 
    res.sendFile(path.join(__dirname, "/public/index.html"))
);
   
app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//API Routing - read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res){
    console.log("hit apinote");
    console.log(savedNotes)
    return res.json(savedNotes);

});

//API Routing - Saving and Deleting new notes
app.post("/api/notes", (req, res) => {
    const newNote = {
        id: uuid.v4(),
        title: req.body.title,
        text: req.body.text
    }
    savedNotes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(savedNotes), function(err) {
        if (err) {
            return console.log("Error:", err)
        }
        console.log("New note successfully saved");
        res.json(newNote);
    }); 
});
//Deleting notes
app.delete("/api/notes/:id", (req,res) => {
    let noteId = req.params.id;
    let noteIndex = 0;
    for (let i = 0; i < savedNotes.length; i++) {
        if (noteId === savedNotes[i].id)
        noteIndex = i;
    }
    savedNotes.splice(noteIndex, 1);
    fs.writeFile("./db/db.json", JSON.stringify(savedNotes), function(err) {
        if (err) {
            return console.log("Error:", err)
        }
        console.log("Note successfully deleted");
        res.json(savedNotes);
    }); 
});


//Defaulting to index.html
app.get("*", (req,res) => 
    res.sendFile(path.join(__dirname, "/public/index.html"))
);
//Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));


