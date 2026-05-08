// Jelentkezés kezelő útvonalak
const express = require('express');
const db = require('../adatbazis');
const { tokenEllenorzes } = require('../koztes/hitelesites');

const router = express.Router();

// POST /api/jelentkezesek - eseményre való jelentkezés
router.post('/', tokenEllenorzes, async (req, res) => {
  const { esemeny_id } = req.body;

  if (!esemeny_id) {
    return res.status(400).json({ hiba: 'esemeny_id megadása kötelező' });
  }

  try {
    // Esemény létezésének és jóváhagyottságának ellenőrzése
    const [esemenyek] = await db.query(
      'SELECT * FROM esemenyek WHERE id = ? AND allapot = ?', [esemeny_id, 'jovahagyott']
    );
    if (esemenyek.length === 0) {
      return res.status(404).json({ hiba: 'Az esemény nem található vagy nincs jóváhagyva' });
    }

    const esemeny = esemenyek[0];

    // Maximum résztvevőszám ellenőrzése
    if (esemeny.max_resztvevok) {
      const [szamlalo] = await db.query(
        'SELECT COUNT(*) AS db FROM jelentkezesek WHERE esemeny_id = ?', [esemeny_id]
      );
      if (szamlalo[0].db >= esemeny.max_resztvevok) {
        return res.status(409).json({ hiba: 'Az esemény betelt' });
      }
    }

    // Duplikált jelentkezés ellenőrzése
    const [meglevo] = await db.query(
      'SELECT id FROM jelentkezesek WHERE felhasznalo_id = ? AND esemeny_id = ?',
      [req.felhasznalo.id, esemeny_id]
    );
    if (meglevo.length > 0) {
      return res.status(409).json({ hiba: 'Már jelentkeztél erre az eseményre' });
    }

    // Jelentkezés mentése
    const [eredmeny] = await db.query(
      'INSERT INTO jelentkezesek (felhasznalo_id, esemeny_id) VALUES (?, ?)',
      [req.felhasznalo.id, esemeny_id]
    );
    res.status(201).json({ id: eredmeny.insertId, uzenet: 'Sikeres jelentkezés' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// DELETE /api/jelentkezesek/:id - jelentkezés lemondása
router.delete('/:id', tokenEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query('SELECT * FROM jelentkezesek WHERE id = ?', [req.params.id]);
    if (sorok.length === 0) return res.status(404).json({ hiba: 'A jelentkezés nem található' });
    if (sorok[0].felhasznalo_id !== req.felhasznalo.id) {
      return res.status(403).json({ hiba: 'Nincs jogosultság a törléshez' });
    }

    await db.query('DELETE FROM jelentkezesek WHERE id = ?', [req.params.id]);
    res.json({ uzenet: 'Jelentkezés lemondva' });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// GET /api/jelentkezesek/sajat - saját jelentkezések listája
router.get('/sajat', tokenEllenorzes, async (req, res) => {
  try {
    const [sorok] = await db.query(
      `SELECT j.*, e.cim, e.datum, e.helyszin
       FROM jelentkezesek j
       JOIN esemenyek e ON j.esemeny_id = e.id
       WHERE j.felhasznalo_id = ?
       ORDER BY e.datum ASC`,
      [req.felhasznalo.id]
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// GET /api/jelentkezesek/esemeny/:esemenyId - esemény összes jelentkezője (szervezőnek)
router.get('/esemeny/:esemenyId', tokenEllenorzes, async (req, res) => {
  try {
    const [esemenyek] = await db.query('SELECT * FROM esemenyek WHERE id = ?', [req.params.esemenyId]);
    if (esemenyek.length === 0) return res.status(404).json({ hiba: 'Az esemény nem található' });
    if (esemenyek[0].szervezo_id !== req.felhasznalo.id && req.felhasznalo.szerepkor !== 'admin') {
      return res.status(403).json({ hiba: 'Nincs jogosultság' });
    }

    const [sorok] = await db.query(
      `SELECT j.*, f.felhasznalonev, f.email FROM jelentkezesek j
       JOIN felhasznalok f ON j.felhasznalo_id = f.id
       WHERE j.esemeny_id = ?`,
      [req.params.esemenyId]
    );
    res.json(sorok);
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

module.exports = router;
