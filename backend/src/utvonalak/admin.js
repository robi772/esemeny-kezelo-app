// Admin útvonalak: események és felhasználók kezelése
const express = require('express');
const db = require('../adatbazis');
const { tokenEllenorzes, adminEllenorzes } = require('../koztes/hitelesites');

const router = express.Router();

// GET /api/admin/esemenyek - összes esemény listázása (minden állapotban)
router.get('/esemenyek', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*, f.felhasznalonev AS szervezo_neve FROM esemenyek e
       JOIN felhasznalok f ON e.szervezo_id = f.id
       ORDER BY e.letrehozva DESC`
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// PATCH /api/admin/esemenyek/:id/allapot - esemény jóváhagyása vagy elutasítása
router.patch('/esemenyek/:id/allapot', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  const { allapot } = req.body;

  // Érvényes állapot ellenőrzése
  if (!['jovahagyott', 'elutasitott'].includes(allapot)) {
    return res.status(400).json({ hiba: 'Az állapot csak jovahagyott vagy elutasitott lehet' });
  }

  try {
    await db.query('UPDATE esemenyek SET allapot = ? WHERE id = ?', [allapot, req.params.id]);
    res.json({ uzenet: `Esemény ${allapot}` });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// DELETE /api/admin/esemenyek/:id - esemény törlése az összes jelentkezésével együtt
router.delete('/esemenyek/:id', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  try {
    // Előbb a kapcsolódó jelentkezések törlése
    await db.query('DELETE FROM jelentkezesek WHERE esemeny_id = ?', [req.params.id]);
    await db.query('DELETE FROM esemenyek WHERE id = ?', [req.params.id]);
    res.json({ uzenet: 'Esemény törölve' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// GET /api/admin/felhasznalok - összes felhasználó listázása
router.get('/felhasznalok', tokenEllenorzes, adminEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      'SELECT id, felhasznalonev, email, szerepkor, letrehozva FROM felhasznalok ORDER BY letrehozva DESC'
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

module.exports = router;
