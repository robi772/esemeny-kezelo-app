// JWT token ellenőrző köztes réteg
const jwt = require('jsonwebtoken');

// Token hitelesítése
const tokenEllenorzes = (req, res, next) => {
  const fejlec = req.headers['authorization'];
  const token = fejlec && fejlec.split(' ')[1];

  if (!token) {
    return res.status(401).json({ hiba: 'Hozzáférési token szükséges' });
  }

  try {
    const dekodolt = jwt.verify(token, process.env.JWT_TITOK || 'titok_kulcs');
    req.felhasznalo = dekodolt;
    next();
  } catch (err) {
    return res.status(403).json({ hiba: 'Érvénytelen vagy lejárt token' });
  }
};

// Admin jogosultság ellenőrzése
const adminEllenorzes = (req, res, next) => {
  if (req.felhasznalo.szerepkor !== 'admin') {
    return res.status(403).json({ hiba: 'Admin jogosultság szükséges' });
  }
  next();
};

module.exports = { tokenEllenorzes, adminEllenorzes };
