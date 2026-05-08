const express = require('express');
const db = require('../db');
const { tokenEllenorzes } = require('../middleware/hitelesites');

const router = express.Router();

// POST /api/jelentkezesek - eseményre való jelentkezés
router.post('/', tokenEllenorzes, async (req, res) => {
  const { esemeny_id } = req.body;

  if (!esemeny_id) {
    return res.status(400).json({ hiba: 'esemeny_id megadása kötelező' });
  }

  try {
    const [esemenyek] = await db.query(
      'SELECT * FROM events WHERE id = ? AND status = ?', [esemeny_id, 'approved']
    );
    if (esemenyek.length === 0) {
      return res.status(404).json({ hiba: 'Esemény nem található vagy nincs jóváhagyva' });
    }

    const esemeny = esemenyek[0];
    if (esemeny.max_participants) {
      const [szamlas] = await db.query(
        'SELECT COUNT(*) as db FROM registrations WHERE event_id = ?', [esemeny_id]
      );
      if (szamlas[0].db >= esemeny.max_participants) {
        return res.status(409).json({ hiba: 'Event is full' });
      }
    }

    const [meglevo] = await db.query(
      'SELECT id FROM registrations WHERE user_id = ? AND event_id = ?',
      [req.felhasznalo.id, esemeny_id]
    );
    if (meglevo.length > 0) {
      return res.status(409).json({ hiba: 'Already registered for this event' });
    }

    const [eredmeny] = await db.query(
      'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
      [req.felhasznalo.id, esemeny_id]
    );
    res.status(201).json({ id: eredmeny.insertId, uzenet: 'Sikeres jelentkezés' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// DELETE /api/jelentkezesek/:id - jelentkezés lemondása
router.delete('/:id', tokenEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query('SELECT * FROM registrations WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ hiba: 'Jelentkezés nem található' });
    if (sorok[0].user_id !== req.felhasznalo.id) return res.status(403).json({ hiba: 'Nincs jogosultság' });

    await db.query('DELETE FROM registrations WHERE id = ?', [req.params.id]);
    res.json({ uzenet: 'Jelentkezés lemondva' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// GET /api/jelentkezesek/sajat - saját jelentkezések
router.get('/sajat', tokenEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT r.*, e.title as cim, e.event_date as esemeny_datuma, e.location as helyszin
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ?
       ORDER BY e.event_date ASC`,
      [req.felhasznalo.id]
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// GET /api/jelentkezesek/esemeny/:esemenyId - esemény résztvevői
router.get('/esemeny/:esemenyId', tokenEllenorzes, async (req, res) => {
  try {
    const [esemenyek] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.esemenyId]);
    if (esemenyek.length === 0) return res.status(404).json({ hiba: 'Esemény nem található' });
    if (esemenyek[0].organizer_id !== req.felhasznalo.id && req.felhasznalo.szerepkor !== 'admin') {
      return res.status(403).json({ hiba: 'Nincs jogosultság' });
    }

    const [sorok] = await db.query(
      `SELECT r.*, u.username as felhasznalonev, u.email FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ?`,
      [req.params.esemenyId]
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

module.exports = router;
