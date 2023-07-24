const express = require('express');
const path = require('path');
const app = express();
const notes = require('./db/db.json');
const fs = require('fs');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
//base page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
//notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);
//API route to get all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => {
        console.log(JSON.parse(data));
        res.json(JSON.parse(data))
    });
})


//post new tip to existing database
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a review`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
        };
        
        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.errored('Error in adding note');
    }
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);