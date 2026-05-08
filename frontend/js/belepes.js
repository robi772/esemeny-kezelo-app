document.getElementById('belepes-urlap')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const hibaBox = document.getElementById('hiba-uzenet');
  const kuldjGomb = e.target.querySelector('button[type=submit]');
  hibaBox.style.display = 'none';
  kuldjGomb.textContent = 'Belépés...';
  kuldjGomb.disabled = true;

  try {
    const adatok = {
      email: document.getElementById('email').value,
      jelszo: document.getElementById('jelszo').value
    };

    const eredmeny = await apiKeres('/hitelesites/belepes', {
      method: 'POST',
      body: JSON.stringify(adatok)
    });

    localStorage.setItem('token', eredmeny.token);
    localStorage.setItem('felhasznalo', JSON.stringify(eredmeny.felhasznalo));
    window.location.href = 'index.html';
  } catch (hiba) {
    hibaBox.style.display = 'block';
    hibaBox.textContent = hiba.message === 'Hibás belépési adatok'
      ? 'Hibás e-mail cím vagy jelszó.'
      : hiba.message;
    kuldjGomb.textContent = 'Belépés';
    kuldjGomb.disabled = false;
  }
});
