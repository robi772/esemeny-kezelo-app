// Környezeti változók betöltése
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Útvonal modulok importálása
const hitelesitesUtvonalak = require('./utvonalak/hitelesites');
const esemenyUtvonalak = require('./utvonalak/esemenyek');
const jelentkezesUtvonalak = require('./utvonalak/jelentkezesek');
const adminUtvonalak = require('./utvonalak/admin');

const app = express();

// Köztes réteg beállítása
app.use(cors());
app.use(express.json());

// API útvonalak regisztrálása
app.use('/api/hitelesites', hitelesitesUtvonalak);
app.use('/api/esemenyek', esemenyUtvonalak);
app.use('/api/jelentkezesek', jelentkezesUtvonalak);
app.use('/api/admin', adminUtvonalak);

// Állapot ellenőrző végpont
app.get('/api/allapot', (req, res) => {
  res.json({ allapot: 'ok', idopont: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

// Szerver indítása (csak közvetlen futtatáskor)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Szerver fut a ${PORT} porton`);
  });
}

module.exports = app;
