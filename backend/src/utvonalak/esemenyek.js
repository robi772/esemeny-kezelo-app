// Esemény kezelő útvonalak
const express = require('express');
const db = require('../adatbazis');
const { tokenEllenorzes } = require('../koztes/hitelesites');

const router = express.Router();

// GET /api/esemenyek - jóváhagyott események listázása
router.get('/', async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*, f.felhasznalonev AS szervezo_neve,
       (SELECT COUNT(*) FROM jelentkezesek j WHERE j.esemeny_id = e.id) AS jelentkezok_szama
       FROM esemenyek e
       JOIN felhasznalok f ON e.szervezo_id = f.id
       WHERE e.allapot = 'jovahagyott'
       ORDER BY e.datum ASC`
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// GET /api/esemenyek/:id - esemény részleteinek lekérése
router.get('/:id', async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*, f.felhasznalonev AS szervezo_neve,
       (SELECT COUNT(*) FROM jelentkezesek j WHERE j.esemeny_id = e.id) AS jelentkezok_szama
       FROM esemenyek e
       JOIN felhasznalok f ON e.szervezo_id = f.id
       WHERE e.id = ?`,
      [req.params.id]
    );
    if (sorok.length === 0) {
      return res.status(404).json({ hiba: 'Az esemény nem található' });
    }
    res.json(sorok[0]);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// POST /api/esemenyek - új esemény létrehozása (hitelesítés szükséges)
router.post('/', tokenEllenorzes, async (req, res) => {
  const { cim, leiras, datum, helyszin, max_resztvevok } = req.body;

  // Kötelező mezők ellenőrzése
  if (!cim || !datum || !helyszin) {
    return res.status(400).json({ hiba: 'Cím, dátum és helyszín megadása kötelező' });
  }

  try {
    const [eredmeny] = await db.query(
      'INSERT INTO esemenyek (cim, leiras, datum, helyszin, max_resztvevok, szervezo_id, allapot) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cim, leiras, datum, helyszin, max_resztvevok || null, req.felhasznalo.id, 'fuggoben']
    );
    res.status(201).json({ id: eredmeny.insertId, uzenet: 'Esemény létrehozva, jóváhagyásra vár' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// PUT /api/esemenyek/:id - saját esemény szerkesztése
router.put('/:id', tokenEllenorzes, async (req, res) => {
  const { cim, leiras, datum, helyszin, max_resztvevok } = req.body;

  try {
    // Esemény létezésének és jogosultságának ellenőrzése
    const [sorok] = await db.query('SELECT * FROM esemenyek WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ hiba: 'Az esemény nem található' });
    if (sorok[0].szervezo_id !== req.felhasznalo.id && req.felhasznalo.szerepkor !== 'admin') {
      return res.status(403).json({ hiba: 'Nincs jogosultság a szerkesztéshez' });
    }

    await db.query(
      'UPDATE esemenyek SET cim=?, leiras=?, datum=?, helyszin=?, max_resztvevok=? WHERE id=?',
      [cim, leiras, datum, helyszin, max_resztvevok, req.params.id]
    );
    res.json({ uzenet: 'Esemény frissítve' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// GET /api/esemenyek/sajat/lista - bejelentkezett szervező saját eseményei
router.get('/sajat/lista', tokenEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT e.*,
       (SELECT COUNT(*) FROM jelentkezesek j WHERE j.esemeny_id = e.id) AS jelentkezok_szama
       FROM esemenyek e WHERE e.szervezo_id = ? ORDER BY e.datum ASC`,
      [req.felhasznalo.id]
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

module.exports = router;
