// Hitelesítési útvonalak: regisztráció és bejelentkezés
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../adatbazis');

const router = express.Router();

// POST /api/hitelesites/regisztracio - új felhasználó létrehozása
router.post('/regisztracio', async (req, res) => {
  const { felhasznalonev, email, jelszo } = req.body;

  // Kötelező mezők ellenőrzése
  if (!felhasznalonev || !email || !jelszo) {
    return res.status(400).json({ hiba: 'Minden mező kitöltése kötelező' });
  }

  try {
    // Email egyediség ellenőrzése
    const [meglevo] = await db.query(
      'SELECT id FROM felhasznalok WHERE email = ?', [email]
    );
    if (meglevo.length > 0) {
      return res.status(409).json({ hiba: 'Ez az email cím már regisztrált' });
    }

    // Jelszó titkosítása
    const jelszoHash = await bcrypt.hash(jelszo, 10);

    // Felhasználó mentése adatbázisba
    const [eredmeny] = await db.query(
      'INSERT INTO felhasznalok (felhasznalonev, email, jelszo_hash, szerepkor) VALUES (?, ?, ?, ?)',
      [felhasznalonev, email, jelszoHash, 'felhasznalo']
    );

    // JWT token generálása
    const token = jwt.sign(
      { id: eredmeny.insertId, felhasznalonev, email, szerepkor: 'felhasznalo' },
      process.env.JWT_TITOK || 'titok_kulcs',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      felhasznalo: { id: eredmeny.insertId, felhasznalonev, email, szerepkor: 'felhasznalo' }
    });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

// POST /api/hitelesites/bejelentkezes - bejelentkezés és token kiadása
router.post('/bejelentkezes', async (req, res) => {
  const { email, jelszo } = req.body;

  // Kötelező mezők ellenőrzése
  if (!email || !jelszo) {
    return res.status(400).json({ hiba: 'Email és jelszó megadása kötelező' });
  }

  try {
    // Felhasználó keresése
    const [sorok] = await db.query('SELECT * FROM felhasznalok WHERE email = ?', [email]);
    if (sorok.length === 0) {
      return res.status(401).json({ hiba: 'Érvénytelen belépési adatok' });
    }

    const felhasznalo = sorok[0];

    // Jelszó ellenőrzése
    const helyes = await bcrypt.compare(jelszo, felhasznalo.jelszo_hash);
    if (!helyes) {
      return res.status(401).json({ hiba: 'Érvénytelen belépési adatok' });
    }

    // JWT token generálása
    const token = jwt.sign(
      {
        id: felhasznalo.id,
        felhasznalonev: felhasznalo.felhasznalonev,
        email: felhasznalo.email,
        szerepkor: felhasznalo.szerepkor
      },
      process.env.JWT_TITOK || 'titok_kulcs',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      felhasznalo: {
        id: felhasznalo.id,
        felhasznalonev: felhasznalo.felhasznalonev,
        email: felhasznalo.email,
        szerepkor: felhasznalo.szerepkor
      }
    });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerver hiba', reszletek: err.message });
  }
});

module.exports = router;
