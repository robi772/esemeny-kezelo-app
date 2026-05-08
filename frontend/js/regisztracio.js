document.getElementById('regisztracio-urlap')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const hibaBox = document.getElementById('hiba-uzenet');
  const sikerBox = document.getElementById('siker-uzenet');
  const kuldjGomb = e.target.querySelector('button[type=submit]');
  hibaBox.style.display = 'none';
  sikerBox.style.display = 'none';
  kuldjGomb.textContent = 'Regisztráció...';
  kuldjGomb.disabled = true;

  try {
    const adatok = {
      felhasznalonev: document.getElementById('felhasznalonev').value,
      email: document.getElementById('email').value,
      jelszo: document.getElementById('jelszo').value
    };

    const eredmeny = await apiKeres('/hitelesites/regisztracio', {
      method: 'POST',
      body: JSON.stringify(adatok)
    });

    localStorage.setItem('token', eredmeny.token);
    localStorage.setItem('felhasznalo', JSON.stringify(eredmeny.felhasznalo));
    sikerBox.style.display = 'block';
    sikerBox.textContent = 'Sikeres regisztráció! Átirányítás...';
    setTimeout(() => window.location.href = 'index.html', 900);
  } catch (hiba) {
    hibaBox.style.display = 'block';
    hibaBox.textContent = hiba.message === 'Ez az e-mail cím már regisztrált'
      ? 'Ez az e-mail cím már regisztrált.'
      : hiba.message;
    kuldjGomb.textContent = 'Regisztráció';
    kuldjGomb.disabled = false;
  }
});
