// Alap API URL - minden kérés ezen keresztül megy
const API_ALAP = '/api';

/**
 * Általános API kérés küldő függvény
 * Automatikusan hozzáadja a JWT tokent, ha rendelkezésre áll
 */
async function apiKeres(vegpont, beallitasok = {}) {
  const token = localStorage.getItem('token');

  const fejlecek = {
    'Content-Type': 'application/json',
    ...(beallitasok.headers || {})
  };

  // Token hozzáadása, ha be van jelentkezve
  if (token) {
    fejlecek.Authorization = `Bearer ${token}`;
  }

  const valasz = await fetch(`${API_ALAP}${vegpont}`, {
    ...beallitasok,
    headers: fejlecek
  });

  const adatok = await valasz.json().catch(() => ({}));

  if (!valasz.ok) {
    throw new Error(adatok.hiba || 'Ismeretlen hiba történt');
  }

  return adatok;
}
