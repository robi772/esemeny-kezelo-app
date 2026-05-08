// Sajat esemenyek es jelentkezesek oldal betoltese
async function sajatAdatokBetoltese() {
  // Csak bejelentkezett felhasznalo erheti el
  bejelentkezesKotelez();

  const esemenyekDoboz = document.getElementById('sajat-esemenyek-lista');
  const jelentkezesekDoboz = document.getElementById('sajat-jelentkezesek-lista');

  try {
    // Parhuzamos adatbetoltes a gyorsabb megjelenes erdekeben
    const [esemenyek, jelentkezesek] = await Promise.all([
      apiKeres('/esemenyek/sajat/lista'),
      apiKeres('/jelentkezesek/sajat')
    ]);

    // Sajat esemenyek megjeleniteseconst
    esemenyekDoboz.innerHTML = esemenyek.length
      ? esemenyek.map(e => `
        <div class="esemeny-kartya">
          <h3>${e.cim}</h3>
          <p><strong>Datum:</strong> ${new Date(e.datum).toLocaleString('hu-HU')}</p>
          <p><strong>Helyszin:</strong> ${e.helyszin}</p>
          <p><strong>Allapot:</strong> <span class="allapot-${e.allapot}">${e.allapot}</span></p>
          <p><strong>Jelentkezok:</strong> ${e.jelentkezok_szama}</p>
          <a class="gomb gomb-masodlagos" href="esemeny-reszletek.html?id=${e.id}">Megtekintes</a>
        </div>
      `).join('')
      : '<p class="ures-lista">Meg nincs sajat esemenyed.</p>';

    // Jelentkezesek megjeleniteseconst
    jelentkezesekDoboz.innerHTML = jelentkezesek.length
      ? jelentkezesek.map(j => `
        <div class="esemeny-kartya">
          <h3>${j.cim}</h3>
          <p><strong>Datum:</strong> ${new Date(j.datum).toLocaleString('hu-HU')}</p>
          <p><strong>Helyszin:</strong> ${j.helyszin}</p>
          <a class="gomb gomb-masodlagos" href="esemeny-reszletek.html?id=${j.esemeny_id}">Megtekintes</a>
        </div>
      `).join('')
      : '<p class="ures-lista">Meg nincs jelentkezesed.</p>';
  } catch (hiba) {
    esemenyekDoboz.innerHTML = `<div class="figyelmeztes hiba">${hiba.message}</div>`;
    jelentkezesekDoboz.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', sajatAdatokBetoltese);
