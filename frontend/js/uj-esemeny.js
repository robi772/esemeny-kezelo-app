// Uj esemeny letrehozasa urlap kezelo
document.addEventListener('DOMContentLoaded', () => {
  // Csak bejelentkezett felhasznalo erheti el
  bejelentkezesKotelez();

  document.getElementById('uj-esemeny-urlap')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const hibaDoboz = document.getElementById('hiba-uzenet');
    const sikerDoboz = document.getElementById('siker-uzenet');
    hibaDoboz.style.display = 'none';
    sikerDoboz.style.display = 'none';

    try {
      const adatok = {
        cim: document.getElementById('cim').value,
        leiras: document.getElementById('leiras').value,
        // datetime-local formatumbol MySQL formatumra alakitas
        datum: document.getElementById('datum').value.replace('T', ' ') + ':00',
        helyszin: document.getElementById('helyszin').value,
        max_resztvevok: document.getElementById('max_resztvevok').value || null
      };

      await apiKeres('/esemenyek', {
        method: 'POST',
        body: JSON.stringify(adatok)
      });

      sikerDoboz.style.display = 'block';
      sikerDoboz.textContent = 'Esemeny letrehozva! Admin jovahagyasara var.';
      e.target.reset();
    } catch (hiba) {
      hibaDoboz.style.display = 'block';
      hibaDoboz.textContent = hiba.message;
    }
  });
});
