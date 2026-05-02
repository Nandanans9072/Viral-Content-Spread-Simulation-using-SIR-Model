const express = require('express');
const router  = express.Router();
const db      = require('../db');
const protect = require('../middleware/auth');

// Create a new repository
router.post('/', protect, async (req, res) => {
  const { name, description, is_private } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO repositories (name, description, owner_id, is_private) VALUES (?,?,?,?)',
      [name, description, req.user.id, is_private || false]
    );
    res.json({ repo_id: result.insertId, message: 'Repository created' });
  } catch (err) {
    res.status(500).json({ error: 'Could not create repository' });
  }
});

// Get all repositories (public ones + user's own)
router.get('/', protect, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.username as owner_name 
       FROM repositories r 
       JOIN users u ON r.owner_id = u.id
       WHERE r.is_private = FALSE OR r.owner_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch repositories' });
  }
});

// Get a single repository by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const [[repo]] = await db.query(
      `SELECT r.*, u.username as owner_name 
       FROM repositories r 
       JOIN users u ON r.owner_id = u.id
       WHERE r.id = ?`,
      [req.params.id]
    );
    if (!repo) return res.status(404).json({ error: 'Repository not found' });

    // Also get all PRs for this repo
    const [prs] = await db.query(
      `SELECT pr.*, u.username as author
       FROM pull_requests pr
       JOIN users u ON pr.author_id = u.id
       WHERE pr.repo_id = ?
       ORDER BY pr.created_at DESC`,
      [req.params.id]
    );

    res.json({ ...repo, pull_requests: prs });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch repository' });
  }
});

// Update repository details
router.put('/:id', protect, async (req, res) => {
  const { name, description, is_private } = req.body;
  try {
    const [[repo]] = await db.query(
      'SELECT * FROM repositories WHERE id = ?', [req.params.id]
    );
    if (!repo) return res.status(404).json({ error: 'Not found' });
    if (repo.owner_id !== req.user.id)
      return res.status(403).json({ error: 'Not your repository' });

    await db.query(
      'UPDATE repositories SET name=?, description=?, is_private=? WHERE id=?',
      [name || repo.name, description || repo.description, is_private ?? repo.is_private, req.params.id]
    );
    res.json({ message: 'Repository updated' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update repository' });
  }
});

// Delete a repository (only owner can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const [[repo]] = await db.query(
      'SELECT * FROM repositories WHERE id = ?', [req.params.id]
    );
    if (!repo) return res.status(404).json({ error: 'Not found' });
    if (repo.owner_id !== req.user.id)
      return res.status(403).json({ error: 'Not your repository' });

    await db.query('DELETE FROM repositories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Repository deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete repository' });
  }
});

module.exports = router;