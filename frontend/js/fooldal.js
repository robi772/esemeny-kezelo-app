async function esemenyekBetoltese() {
  const racs = document.getElementById('esemenyek-racs');

  try {
    const esemenyek = await apiKeres('/esemenyek');
    if (!esemenyek.length) {
      racs.innerHTML = '<p class="muted">Nincs elérhető esemény.</p>';
      return;
    }

    racs.innerHTML = esemenyek.map(esemeny => `
      <div class="esemeny-kartya">
        <div class="esemeny-kartya-test">
          <h3>${esemeny.title}</h3>
          <p class="esemeny-leiras">${esemeny.description || 'Nincs leírás.'}</p>
          <p><span class="cimke">📅 Dátum:</span> ${new Date(esemeny.event_date).toLocaleString('hu-HU')}</p>
          <p><span class="cimke">📍 Helyszín:</span> ${esemeny.location}</p>
          <p><span class="cimke">👤 Szervező:</span> ${esemeny.szervezo_neve}</p>
          <p><span class="cimke">👥 Jelentkezők:</span> ${esemeny.jelentkezok_szama}${esemeny.max_participants ? ' / ' + esemeny.max_participants : ''}</p>
        </div>
        <div class="esemeny-kartya-lab">
          <a class="gomb gomb-elsdleges" href="esemeny-reszletek.html?id=${esemeny.id}">Részletek →</a>
        </div>
      </div>
    `).join('');
  } catch (hiba) {
    racs.innerHTML = `<div class="figyelmeztetés figyelmeztetés-hiba">Hiba: ${hiba.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', esemenyekBetoltese);
