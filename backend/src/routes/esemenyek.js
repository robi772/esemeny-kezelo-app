const express = require('express');
const db = require('../db');
const { tokenEllenorzes } = require('../middleware/hitelesites');

const router = express.Router();

// GET /api/esemenyek - jóváhagyott események listája
router.get('/', async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*, u.username as szervezo_neve,
       (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as jelentkezok_szama
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.status = 'approved'
       ORDER BY e.event_date ASC`
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// GET /api/esemenyek/sajat - saját események
router.get('/sajat', tokenEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*,
       (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as jelentkezok_szama
       FROM events e WHERE e.organizer_id = ? ORDER BY e.event_date ASC`,
      [req.felhasznalo.id]
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// GET /api/esemenyek/:id - esemény részletei
router.get('/:id', async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*, u.username as szervezo_neve,
       (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as jelentkezok_szama
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = ?`,
      [req.params.id]
    );
    if (sorok.length === 0) {
      return res.status(404).json({ hiba: 'Esemény nem található' });
    }
    res.json(sorok[0]);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// POST /api/esemenyek - új esemény létrehozása
router.post('/', tokenEllenorzes, async (req, res) => {
  const { cim, leiras, esemeny_datuma, helyszin, max_resztvevok } = req.body;

  if (!cim || !esemeny_datuma || !helyszin) {
    return res.status(400).json({ hiba: 'Cím, dátum és helyszín megadása kötelező' });
  }

  try {
    const [eredmeny] = await db.query(
      'INSERT INTO events (title, description, event_date, location, max_participants, organizer_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cim, leiras, esemeny_datuma, helyszin, max_resztvevok || null, req.felhasznalo.id, 'pending']
    );
    res.status(201).json({ id: eredmeny.insertId, uzenet: 'Esemény létrehozva, jóváhagyásra vár' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// PUT /api/esemenyek/:id - esemény szerkesztése
router.put('/:id', tokenEllenorzes, async (req, res) => {
  const { cim, leiras, esemeny_datuma, helyszin, max_resztvevok } = req.body;

  try {
    const [sorok] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ hiba: 'Esemény nem található' });
    if (sorok[0].organizer_id !== req.felhasznalo.id && req.felhasznalo.szerepkor !== 'admin') {
      return res.status(403).json({ hiba: 'Nincs jogosultság' });
    }

    await db.query(
      'UPDATE events SET title=?, description=?, event_date=?, location=?, max_participants=? WHERE id=?',
      [cim, leiras, esemeny_datuma, helyszin, max_resztvevok, req.params.id]
    );
    res.json({ uzenet: 'Esemény frissítve' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

module.exports = router;
