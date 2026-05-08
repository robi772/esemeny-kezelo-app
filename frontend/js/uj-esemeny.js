document.addEventListener('DOMContentLoaded', () => {
  hitelesitesKotelező();

  document.getElementById('uj-esemeny-urlap')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hibaBox = document.getElementById('hiba-uzenet');
    const sikerBox = document.getElementById('siker-uzenet');
    const kuldjGomb = e.target.querySelector('button[type=submit]');
    hibaBox.style.display = 'none';
    sikerBox.style.display = 'none';
    kuldjGomb.textContent = 'Létrehozás...';
    kuldjGomb.disabled = true;

    try {
      const adatok = {
        cim: document.getElementById('cim').value,
        leiras: document.getElementById('leiras').value,
        esemeny_datuma: document.getElementById('esemeny_datuma').value.replace('T', ' ') + ':00',
        helyszin: document.getElementById('helyszin').value,
        max_resztvevok: document.getElementById('max_resztvevok').value || null
      };

      await apiKeres('/esemenyek', {
        method: 'POST',
        body: JSON.stringify(adatok)
      });

      sikerBox.style.display = 'block';
      sikerBox.textContent = '✓ Esemény sikeresen létrehozva! Jóváhagyásra vár.';
      e.target.reset();
    } catch (hiba) {
      hibaBox.style.display = 'block';
      hibaBox.textContent = 'Hiba: ' + hiba.message;
    } finally {
      kuldjGomb.textContent = 'Esemény létrehozása';
      kuldjGomb.disabled = false;
    }
  });
});
