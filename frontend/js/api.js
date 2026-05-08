const API_ALAP = '/api';

async function apiKeres(vegpont, beallitasok = {}) {
  const token = localStorage.getItem('token');

  const fejlecek = {
    'Content-Type': 'application/json',
    ...(beallitasok.headers || {})
  };

  if (token) {
    fejlecek.Authorization = `Bearer ${token}`;
  }

  const valasz = await fetch(`${API_ALAP}${vegpont}`, {
    ...beallitasok,
    headers: fejlecek
  });

  const adatok = await valasz.json().catch(() => ({}));

  if (!valasz.ok) {
    throw new Error(adatok.hiba || adatok.error || 'Ismeretlen hiba');
  }

  return adatok;
}
