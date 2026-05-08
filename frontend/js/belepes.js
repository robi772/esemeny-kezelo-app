// Belepes urlap kezelo
document.getElementById('belepes-urlap')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const hibaDoboZ = document.getElementById('hiba-uzenet');
  hibaDoboZ.style.display = 'none';

  try {
    const adatok = {
      email: document.getElementById('email').value,
      jelszo: document.getElementById('jelszo').value
    };

    // Bejelentkezesi keres kuldese
    const eredmeny = await apiKeres('/hitelesites/bejelentkezes', {
      method: 'POST',
      body: JSON.stringify(adatok)
    });

    // Token es felhasznalo adatok mentese
    localStorage.setItem('token', eredmeny.token);
    localStorage.setItem('felhasznalo', JSON.stringify(eredmeny.felhasznalo));
    window.location.href = 'index.html';
  } catch (hiba) {
    hibaDoboZ.style.display = 'block';
    hibaDoboZ.textContent = hiba.message;
  }
});
