// Futtasd egyszer a helyes bcrypt hash generalasahoz:
// node backend/init-admin.js
const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('password', 10);
  console.log('Bcrypt hash a \'password\' jelszóhoz:');
  console.log(hash);
  console.log('\nMasold be ezt a database/schema.sql-be a password_hash mezobe!');
}

generateHash();
