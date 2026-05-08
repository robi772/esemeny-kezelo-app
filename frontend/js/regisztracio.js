// Regisztracis urlap kezelo
document.getElementById('regisztracio-urlap')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const hibaDoboZ = document.getElementById('hiba-uzenet');
  const sikerDoboz = document.getElementById('siker-uzenet');
  hibaDoboZ.style.display = 'none';
  sikerDoboz.style.display = 'none';

  try {
    const adatok = {
      felhasznalonev: document.getElementById('felhasznalonev').value,
      email: document.getElementById('email').value,
      jelszo: document.getElementById('jelszo').value
    };

    // Regisztracios keres kuldese
    const eredmeny = await apiKeres('/hitelesites/regisztracio', {
      method: 'POST',
      body: JSON.stringify(adatok)
    });

    // Automatikus bejelentkezes regisztracio utan
    localStorage.setItem('token', eredmeny.token);
    localStorage.setItem('felhasznalo', JSON.stringify(eredmeny.felhasznalo));
    sikerDoboz.style.display = 'block';
    sikerDoboz.textContent = 'Sikeres regisztracio! Atiranyitas...';
    setTimeout(() => window.location.href = 'index.html', 800);
  } catch (hiba) {
    hibaDoboZ.style.display = 'block';
    hibaDoboZ.textContent = hiba.message;
  }
});
