const express  = require('express');
const router   = express.Router();
const db       = require('../db');
const protect  = require('../middleware/auth');

// Create PR
router.post('/', protect, async (req, res) => {
  const { title, description, repo_id, source_branch, target_branch } = req.body;
  const [result] = await db.query(
    'INSERT INTO pull_requests (title, description, author_id, repo_id, source_branch, target_branch) VALUES (?,?,?,?,?,?)',
    [title, description, req.user.id, repo_id, source_branch, target_branch || 'main']
  );
  res.json({ pr_id: result.insertId });
});

// Get all PRs
router.get('/', protect, async (req, res) => {
  const [rows] = await db.query(
    `SELECT pr.*, u.username as author 
     FROM pull_requests pr 
     JOIN users u ON pr.author_id = u.id 
     ORDER BY pr.created_at DESC`
  );
  res.json(rows);
});

// Get single PR with comments and reviews
router.get('/:id', protect, async (req, res) => {
  const [[pr]] = await db.query('SELECT * FROM pull_requests WHERE id = ?', [req.params.id]);
  const [comments] = await db.query(
    'SELECT c.*, u.username FROM pr_comments c JOIN users u ON c.author_id = u.id WHERE c.pr_id = ?',
    [req.params.id]
  );
  const [reviews] = await db.query(
    'SELECT r.*, u.username FROM pr_reviews r JOIN users u ON r.reviewer_id = u.id WHERE r.pr_id = ?',
    [req.params.id]
  );
  res.json({ ...pr, comments, reviews });
});

// Approve or Reject PR
router.post('/:id/review', protect, async (req, res) => {
  const { decision, comment } = req.body; // decision: 'approved' | 'rejected' | 'changes_requested'
  await db.query(
    'INSERT INTO pr_reviews (pr_id, reviewer_id, decision, comment) VALUES (?,?,?,?)',
    [req.params.id, req.user.id, decision, comment]
  );
  if (decision === 'approved' || decision === 'rejected') {
    await db.query('UPDATE pull_requests SET status = ? WHERE id = ?', [decision, req.params.id]);
  }
  res.json({ message: 'Review submitted' });
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
  const { body, file_path, line_number } = req.body;
  await db.query(
    'INSERT INTO pr_comments (pr_id, author_id, body, file_path, line_number) VALUES (?,?,?,?,?)',
    [req.params.id, req.user.id, body, file_path, line_number]
  );
  res.json({ message: 'Comment added' });
});

// Request reviewer
router.post('/:id/request-review', protect, async (req, res) => {
  const { reviewer_id } = req.body;
  await db.query(
    'INSERT IGNORE INTO pr_reviewers (pr_id, reviewer_id) VALUES (?,?)',
    [req.params.id, reviewer_id]
  );
  res.json({ message: 'Reviewer requested' });
});

module.exports = router;