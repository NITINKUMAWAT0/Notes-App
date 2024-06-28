const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const [notes] = await pool.query('SELECT * FROM notes ORDER BY pinned DESC');
    res.json(notes);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET note by ID
router.get('/:id', async (req, res) => {
  try {
    const [notes] = await pool.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    if (notes.length > 0) {
      res.json(notes[0]);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query error' });
  }
});

// CREATE a new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const [result] = await pool.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
    res.status(201).json({ id: result.insertId, title, content, pinned: false });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({ error: 'Database insert error' });
  }
});

// UPDATE note by ID (using PATCH)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, pinned } = req.body;

  try {
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (pinned !== undefined) updates.pinned = pinned;

    const [result] = await pool.query('UPDATE notes SET ? WHERE id = ?', [updates, id]);

    if (result.affectedRows > 0) {
      const updatedNote = { id, ...updates };
      res.json(updatedNote);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ error: 'Database update error' });
  }
});

// DELETE note by ID
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).json({ error: 'Database delete error' });
  }
});

module.exports = router;
