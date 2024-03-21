const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to SQLite database
const db = new sqlite3.Database('notes.db');

// Get all notes
router.get('/', (req, res) => {
    db.all('SELECT * FROM notes', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

router.get('/length', (req, res) => {
    db.get('SELECT COUNT(*) AS count FROM notes', (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(row.count);
        }
    });
});

// Get a single note
router.get('/:id', (req, res) => {
    const noteId = req.params.id;
    db.get('SELECT * FROM notes WHERE id = ?', [noteId], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).send('Note not found');
        }
    });
});

// Create a new note
router.post('/', (req, res) => {
    const newNote = req.body;
    db.run('INSERT INTO notes (title, content) VALUES (?, ?)', [newNote.title, newNote.content], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).send(`Note added successfully with id: ${this.lastID}`);
        }
    });
});

// Update a note
router.put('/:id', async (req, res) => {
    const noteId = req.params.id;
    const updatedNote = req.body;
    db.run('UPDATE notes SET content = ? WHERE id = ?', [updatedNote.content_thing, noteId], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else if (this.changes > 0) {
            res.send('Note updated successfully');
        } else {
            res.status(404).send('Note not found');
        }
    });
});

// Delete a note
router.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    db.run('DELETE FROM notes WHERE id = ?', [noteId], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else if (this.changes > 0) {
            res.send('Note deleted successfully');
        } else {
            res.status(404).send('Note not found');
        }
    });
});

module.exports = router;
