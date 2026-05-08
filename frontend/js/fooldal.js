// Fooldal: jovahagyott esemenyek betoltese es megjeleniteseconst
async function esemenyekBetoltese() {
  const racs = document.getElementById('esemenyek-racs');

  try {
    const esemenyek = await apiKeres('/esemenyek');

    if (!esemenyek.length) {
      racs.innerHTML = '<p class="ures-lista">Jelenleg nincs elerheto esemeny.</p>';
      return;
    }

    // Esemeny kartyak generalasa
    racs.innerHTML = esemenyek.map(esemeny => `
      <div class="esemeny-kartya">
        <h3>${esemeny.cim}</h3>
        <p class="leiras">${esemeny.leiras || 'Nincs leiras.'}</p>
        <p><strong>Datum:</strong> ${new Date(esemeny.datum).toLocaleString('hu-HU')}</p>
        <p><strong>Helyszin:</strong> ${esemeny.helyszin}</p>
        <p><strong>Szervezo:</strong> ${esemeny.szervezo_neve}</p>
        <p><strong>Jelentkezok:</strong> ${esemeny.jelentkezok_szama}${esemeny.max_resztvevok ? ' / ' + esemeny.max_resztvevok : ''}</p>
        <a class="gomb gomb-primary" href="esemeny-reszletek.html?id=${esemeny.id}">Reszletek</a>
      </div>
    `).join('');
  } catch (hiba) {
    racs.innerHTML = `<div class="figyelmeztes hiba">${hiba.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', esemenyekBetoltese);
