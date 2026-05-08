document.addEventListener('DOMContentLoaded', function() {
  hitelesitesKotelezo();

  var urlap = document.getElementById('uj-esemeny-urlap');
  if (!urlap) return;

  urlap.addEventListener('submit', async function(e) {
    e.preventDefault();
    var hibaBox = document.getElementById('hiba-uzenet');
    var sikerBox = document.getElementById('siker-uzenet');
    var kuldjGomb = e.target.querySelector('button[type=submit]');
    hibaBox.style.display = 'none';
    sikerBox.style.display = 'none';
    kuldjGomb.textContent = 'Letrehozas...';
    kuldjGomb.disabled = true;

    try {
      var adatok = {
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
      sikerBox.textContent = 'Esemeny sikeresen letrehozva! Jovahagyasra var.';
      e.target.reset();
    } catch (hiba) {
      hibaBox.style.display = 'block';
      hibaBox.textContent = 'Hiba: ' + hiba.message;
    } finally {
      kuldjGomb.textContent = 'Esemeny letrehozasa';
      kuldjGomb.disabled = false;
    }
  });
});
