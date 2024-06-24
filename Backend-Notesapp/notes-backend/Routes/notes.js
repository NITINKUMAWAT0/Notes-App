// routes/notes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [notes] = await db.query('SELECT * FROM notes');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [notes] = await db.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    if (notes.length > 0) {
      res.json(notes[0]);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    const [result] = await db.query('INSERT INTO notes (content) VALUES (?)', [content]);
    res.status(201).json({ id: result.insertId, content });
  } catch (error) {
    res.status(500).json({ error: 'Database insert error' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const [result] = await db.query('UPDATE notes SET content = ? WHERE id = ?', [content, req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ id: req.params.id, content });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database update error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database delete error' });
  }
});

module.exports = router;
