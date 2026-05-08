require('dotenv').config();
const express = require('express');
const cors = require('cors');
const hitelesitesUtvonalak = require('./routes/hitelesites');
const esemenyUtvonalak = require('./routes/esemenyek');
const jelentkezesUtvonalak = require('./routes/jelentkezesek');
const adminUtvonalak = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

// Útvonalak
app.use('/api/hitelesites', hitelesitesUtvonalak);
app.use('/api/esemenyek', esemenyUtvonalak);
app.use('/api/jelentkezesek', jelentkezesUtvonalak);
app.use('/api/admin', adminUtvonalak);

app.get('/api/allapot', (req, res) => {
  res.json({ allapot: 'ok', idopont: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Szerver fut a ${PORT} porton`);
  });
}

module.exports = app;
