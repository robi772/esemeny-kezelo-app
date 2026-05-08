const jwt = require('jsonwebtoken');

const tokenEllenorzes = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ hiba: 'Hozzáférési token szükséges' });
  }

  try {
    const dekodalt = jwt.verify(token, process.env.JWT_TITOK || 'titok_kulcs');
    req.felhasznalo = dekodalt;
    next();
  } catch (err) {
    return res.status(403).json({ hiba: 'Érvénytelen vagy lejárt token' });
  }
};

const adminEllenorzes = (req, res, next) => {
  if (req.felhasznalo.szerepkor !== 'admin') {
    return res.status(403).json({ hiba: 'Admin hozzáférés szükséges' });
  }
  next();
};

module.exports = { tokenEllenorzes, adminEllenorzes };
