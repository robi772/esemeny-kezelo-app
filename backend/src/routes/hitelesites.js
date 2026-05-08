const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /api/hitelesites/regisztracio
router.post('/regisztracio', async (req, res) => {
  const { felhasznalonev, email, jelszo } = req.body;

  if (!felhasznalonev || !email || !jelszo) {
    return res.status(400).json({ hiba: 'Minden mező kitöltése kötelező' });
  }

  try {
    const [meglevo] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (meglevo.length > 0) {
      return res.status(409).json({ hiba: 'Ez az e-mail cím már regisztrált' });
    }

    const jelszoHash = await bcrypt.hash(jelszo, 10);
    const [eredmeny] = await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [felhasznalonev, email, jelszoHash, 'user']
    );

    const token = jwt.sign(
      { id: eredmeny.insertId, felhasznalonev, email, szerepkor: 'user' },
      process.env.JWT_TITOK || 'titok_kulcs',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      felhasznalo: { id: eredmeny.insertId, felhasznalonev, email, szerepkor: 'user' }
    });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

// POST /api/hitelesites/belepes
router.post('/belepes', async (req, res) => {
  const { email, jelszo } = req.body;

  if (!email || !jelszo) {
    return res.status(400).json({ hiba: 'E-mail és jelszó megadása kötelező' });
  }

  try {
    const [sorok] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (sorok.length === 0) {
      return res.status(401).json({ hiba: 'Hibás belépési adatok' });
    }

    const felhasznalo = sorok[0];
    const ervenyesJelszo = await bcrypt.compare(jelszo, felhasznalo.password_hash);
    if (!ervenyesJelszo) {
      return res.status(401).json({ hiba: 'Hibás belépési adatok' });
    }

    const token = jwt.sign(
      { id: felhasznalo.id, felhasznalonev: felhasznalo.username, email: felhasznalo.email, szerepkor: felhasznalo.role },
      process.env.JWT_TITOK || 'titok_kulcs',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      felhasznalo: { id: felhasznalo.id, felhasznalonev: felhasznalo.username, email: felhasznalo.email, szerepkor: felhasznalo.role }
    });
  } catch (err) {
    res.status(500).json({ hiba: 'Szerverhiba', reszletek: err.message });
  }
});

module.exports = router;
