var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

var combinedNotes = [];

app.get("/,", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req,res) {
  let readNotes = fs.readFileSync(path.join('./db/db.json'), "utf8");  

  res.json(JSON.parse(readNotes));
});

app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  let noteData = fs.readFileSync(path.join('./db/db.json'), "utf8"); 

  combinedNotes = JSON.parse(noteData);
  combinedNotes.push(newNote);
  
  combinedNotes.forEach(assignId);
  
  function assignId(item, index){
      item.id = index + 1;
  };

  let stringifyData = JSON.stringify(combinedNotes)
  fs.writeFileSync(path.join('./db/db.json'), stringifyData, (err) => {
      if (err) throw err;
  });

  res.json(combinedNotes);
  
});

app.delete("/api/notes/:id", function(req, res) { 

var needToDelete = req.params.id;

let noteData = fs.readFileSync(path.join('./db/db.json'), "utf8");
let remove = JSON.parse(noteData).filter(note => note.id !== parseInt(needToDelete));
let stringifyData2 = JSON.stringify(remove);

fs.writeFileSync(path.join('./db/db.json'), stringifyData2, (err) => {
  if (err) throw err;
})
res.json(stringifyData2);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});



