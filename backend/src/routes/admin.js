const express = require('express');
const db = require('../db');
const { tokenEllenorzes, adminEllenorzes } = require('../middleware/hitelesites');

const router = express.Router();

// GET /api/admin/esemenyek
router.get('/esemenyek', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*, u.username as szervezo_neve FROM events e
       JOIN users u ON e.organizer_id = u.id
       ORDER BY e.created_at DESC`
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// PATCH /api/admin/esemenyek/:id/allapot
router.patch('/esemenyek/:id/allapot', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  const { allapot } = req.body;
  if (!['approved', 'rejected'].includes(allapot)) {
    return res.status(400).json({ hiba: 'Az állapot csak: approved vagy rejected lehet' });
  }

  try {
    await db.query('UPDATE events SET status = ? WHERE id = ?', [allapot, req.params.id]);
    res.json({ uzenet: `Esemény állapota frissítve: ${allapot}` });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// DELETE /api/admin/esemenyek/:id
router.delete('/esemenyek/:id', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  try {
    await db.query('DELETE FROM registrations WHERE event_id = ?', [req.params.id]);
    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ uzenet: 'Esemény törölve' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// GET /api/admin/felhasznalok
router.get('/felhasznalok', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

module.exports = router;
