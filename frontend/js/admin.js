// Admin felület JavaScript - esemenyek jovahagyasa, felhasznalok kezelese

/** Ful valtas kezelo */
function fulValtas(fulNev, gomb) {
  document.querySelectorAll('.ful-tartalom').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.ful-gomb').forEach(el => el.classList.remove('aktiv'));
  document.getElementById(`ful-${fulNev}`).style.display = 'block';
  if (gomb) gomb.classList.add('aktiv');
}

/** Esemeny allapotanak frissitese (jovahagyas / elutasitas) */
async function esemenyAllapotFrissites(id, allapot) {
  try {
    await apiKeres(`/admin/esemenyek/${id}/allapot`, {
      method: 'PATCH',
      body: JSON.stringify({ allapot })
    });
    adminAdatokBetoltese(); // Lista frissitese
  } catch (hiba) {
    alert(hiba.message);
  }
}

/** Esemeny torlese megerositessel */
async function esemenyTorles(id) {
  if (!confirm('Biztosan torlod ezt az esemenyt? Ez a muvelet nem vonhato vissza!')) return;
  try {
    await apiKeres(`/admin/esemenyek/${id}`, { method: 'DELETE' });
    adminAdatokBetoltese(); // Lista frissitese
  } catch (hiba) {
    alert(hiba.message);
  }
}

/** Admin adatok betoltese: esemenyek es felhasznalok */
async function adminAdatokBetoltese() {
  // Csak admin ferhet hozza
  bejelentkezesKotelez();
  const felhasznalo = jelenlegiFelhasznalo();
  if (felhasznalo?.szerepkor !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  try {
    // Parhuzamos adatbetoltes
    const [esemenyek, felhasznalok] = await Promise.all([
      apiKeres('/admin/esemenyek'),
      apiKeres('/admin/felhasznalok')
    ]);

    // Fuggoben levo esemenyek
    const fuggoben = esemenyek.filter(e => e.allapot === 'fuggoben');
    document.getElementById('fuggoben-esemenyek').innerHTML = fuggoben.length
      ? fuggoben.map(e => `
        <div class="esemeny-kartya">
          <h3>${e.cim}</h3>
          <p><strong>Helyszin:</strong> ${e.helyszin}</p>
          <p><strong>Datum:</strong> ${new Date(e.datum).toLocaleString('hu-HU')}</p>
          <p><strong>Szervezo:</strong> ${e.szervezo_neve}</p>
          <button class="gomb gomb-primary" onclick="esemenyAllapotFrissites(${e.id}, 'jovahagyott')">Jovahagyas</button>
          <button class="gomb gomb-masodlagos" onclick="esemenyAllapotFrissites(${e.id}, 'elutasitott')">Elutasitas</button>
        </div>
      `).join('')
      : '<p class="ures-lista">Nincs fuggoben levo esemeny.</p>';

    // Osszes esemeny
    document.getElementById('osszes-esemeny').innerHTML = esemenyek.length
      ? esemenyek.map(e => `
        <div class="esemeny-kartya">
          <h3>${e.cim}</h3>
          <p><strong>Allapot:</strong> <span class="allapot-${e.allapot}">${e.allapot}</span></p>
          <p><strong>Szervezo:</strong> ${e.szervezo_neve}</p>
          <button class="gomb gomb-masodlagos" onclick="esemenyTorles(${e.id})">Torles</button>
        </div>
      `).join('')
      : '<p class="ures-lista">Nincs esemeny.</p>';

    // Felhasznalok listaja
    document.getElementById('felhasznalok-lista').innerHTML = felhasznalok.length
      ? felhasznalok.map(f => `
        <div class="esemeny-kartya">
          <h3>${f.felhasznalonev}</h3>
          <p>${f.email}</p>
          <p><strong>Szerepkor:</strong> ${f.szerepkor}</p>
          <p><strong>Regisztralt:</strong> ${new Date(f.letrehozva).toLocaleDateString('hu-HU')}</p>
        </div>
      `).join('')
      : '<p class="ures-lista">Nincs felhasznalo.</p>';
  } catch (hiba) {
    document.getElementById('fuggoben-esemenyek').innerHTML =
      `<div class="figyelmeztes hiba">${hiba.message}</div>`;
  }
}

// Oldal betoltesekor: ful gombok beallitasa es adatok betoltese
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ful-gomb').forEach(gomb => {
    gomb.addEventListener('click', () => fulValtas(gomb.dataset.ful, gomb));
  });
  adminAdatokBetoltese();
});
