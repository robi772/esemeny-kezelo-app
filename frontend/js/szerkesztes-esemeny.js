function getEsemenyId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function esemenyAdatokBetoltese() {
  hitelesitesKotelező();
  const esemenyId = getEsemenyId();
  const hibaBox = document.getElementById('hiba-uzenet');

  if (!esemenyId) {
    hibaBox.style.display = 'block';
    hibaBox.textContent = 'Hiányzó esemény azonosító.';
    return;
  }

  try {
    const esemeny = await apiKeres(`/esemenyek/${esemenyId}`);
    document.getElementById('cim').value = esemeny.title || '';
    document.getElementById('leiras').value = esemeny.description || '';
    document.getElementById('helyszin').value = esemeny.location || '';
    document.getElementById('max_resztvevok').value = esemeny.max_participants || '';

    if (esemeny.event_date) {
      const dt = new Date(esemeny.event_date);
      const helyi = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16);
      document.getElementById('esemeny_datuma').value = helyi;
    }
  } catch (hiba) {
    hibaBox.style.display = 'block';
    hibaBox.textContent = 'Nem sikerült betölteni az eseményt: ' + hiba.message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  esemenyAdatokBetoltese();

  document.getElementById('szerkesztes-urlap')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hibaBox = document.getElementById('hiba-uzenet');
    const sikerBox = document.getElementById('siker-uzenet');
    const kuldjGomb = e.target.querySelector('button[type=submit]');
    hibaBox.style.display = 'none';
    sikerBox.style.display = 'none';
    kuldjGomb.textContent = 'Mentés...';
    kuldjGomb.disabled = true;

    try {
      const adatok = {
        cim: document.getElementById('cim').value,
        leiras: document.getElementById('leiras').value,
        esemeny_datuma: document.getElementById('esemeny_datuma').value.replace('T', ' ') + ':00',
        helyszin: document.getElementById('helyszin').value,
        max_resztvevok: document.getElementById('max_resztvevok').value || null
      };

      await apiKeres(`/esemenyek/${getEsemenyId()}`, {
        method: 'PUT',
        body: JSON.stringify(adatok)
      });

      sikerBox.style.display = 'block';
      sikerBox.textContent = '✓ Esemény sikeresen frissítve!';
      setTimeout(() => window.location.href = 'sajat-esemenyek.html', 1200);
    } catch (hiba) {
      hibaBox.style.display = 'block';
      hibaBox.textContent = 'Hiba: ' + hiba.message;
      kuldjGomb.textContent = 'Mentés';
      kuldjGomb.disabled = false;
    }
  });
});
