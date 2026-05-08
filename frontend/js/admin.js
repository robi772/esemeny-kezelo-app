function tabMutatasa(tab, gomb) {
  document.querySelectorAll('.tab-tartalom').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-gomb').forEach(el => el.classList.remove('aktiv'));
  document.getElementById('tab-' + tab).style.display = 'block';
  if (gomb) gomb.classList.add('aktiv');
}

async function esemenyAllapotFrissitese(id, allapot) {
  const cimke = allapot === 'approved' ? 'jovahagyod' : 'elutasitod';
  if (!confirm('Biztosan ' + cimke + ' ezt az esemenyt?')) return;
  try {
    await apiKeres('/admin/esemenyek/' + id + '/allapot', {
      method: 'PATCH',
      body: JSON.stringify({ allapot })
    });
    adminAdatokBetoltese();
  } catch (hiba) {
    alert('Hiba: ' + hiba.message);
  }
}

async function esemenyTorlese(id) {
  if (!confirm('Biztosan torlod ezt az esemenyt? Ez a muvelet nem vonhato vissza.')) return;
  try {
    await apiKeres('/admin/esemenyek/' + id, { method: 'DELETE' });
    adminAdatokBetoltese();
  } catch (hiba) {
    alert('Hiba: ' + hiba.message);
  }
}

async function adminAdatokBetoltese() {
  if (!beVanLepve()) {
    window.location.href = 'belepes.html';
    return;
  }
  const felhasznalo = getJelenlegiFelhasznalo();
  if (!isAdmin(felhasznalo)) {
    window.location.href = 'index.html';
    return;
  }

  const allapotCimkek = { approved: 'Jovahagyott', pending: 'Fuggőben', rejected: 'Elutasitott' };
  const allapotOsztaly = { approved: 'siker', pending: 'figyelmeztes', rejected: 'hiba' };

  try {
    const [esemenyek, felhasznalok] = await Promise.all([
      apiKeres('/admin/esemenyek'),
      apiKeres('/admin/felhasznalok')
    ]);

    const fuggoBen = esemenyek.filter(e => e.status === 'pending');

    document.getElementById('fuggoben-esemenyek').innerHTML = fuggoBen.length
      ? fuggoBen.map(e =>
          '<div class="esemeny-kartya"><div class="esemeny-kartya-test">'
          + '<h3>' + e.title + '</h3>'
          + '<p><span class="cimke">Helyszin:</span> ' + e.location + '</p>'
          + '<p><span class="cimke">Datum:</span> ' + new Date(e.event_date).toLocaleString('hu-HU') + '</p>'
          + '<p><span class="cimke">Szervezo:</span> ' + e.szervezo_neve + '</p>'
          + '</div><div class="esemeny-kartya-lab">'
          + '<button class="gomb gomb-elsdleges" onclick="esemenyAllapotFrissitese(' + e.id + ', \'approved\')">Jovahagyas</button>'
          + '<button class="gomb gomb-masodlagos" onclick="esemenyAllapotFrissitese(' + e.id + ', \'rejected\')">Elutasitas</button>'
          + '</div></div>'
        ).join('')
      : '<p class="halvany">Nincs fuggoben levo esemeny.</p>';

    document.getElementById('osszes-esemeny').innerHTML = esemenyek.length
      ? esemenyek.map(e =>
          '<div class="esemeny-kartya"><div class="esemeny-kartya-test">'
          + '<h3>' + e.title + '</h3>'
          + '<p><span class="cimke">Statusz:</span> <span class="jelveny jelveny-' + (allapotOsztaly[e.status] || '') + '">' + (allapotCimkek[e.status] || e.status) + '</span></p>'
          + '<p><span class="cimke">Szervezo:</span> ' + e.szervezo_neve + '</p>'
          + '<p><span class="cimke">Datum:</span> ' + new Date(e.event_date).toLocaleString('hu-HU') + '</p>'
          + '</div><div class="esemeny-kartya-lab">'
          + '<button class="gomb gomb-veszelyes" onclick="esemenyTorlese(' + e.id + ')">Torles</button>'
          + '</div></div>'
        ).join('')
      : '<p class="halvany">Nincs esemeny.</p>';

    document.getElementById('felhasznalok-lista').innerHTML = felhasznalok.length
      ? felhasznalok.map(f =>
          '<div class="esemeny-kartya"><div class="esemeny-kartya-test">'
          + '<h3>' + f.username + '</h3>'
          + '<p>' + f.email + '</p>'
          + '<p><span class="cimke">Szerepkor:</span> ' + f.role + '</p>'
          + '<p><span class="cimke">Regisztralt:</span> ' + new Date(f.created_at).toLocaleDateString('hu-HU') + '</p>'
          + '</div></div>'
        ).join('')
      : '<p class="halvany">Nincs felhasznalo.</p>';

  } catch (hiba) {
    document.getElementById('fuggoben-esemenyek').innerHTML = '<div class="figyelmeztes-hiba">Hiba: ' + hiba.message + '</div>';
    document.getElementById('osszes-esemeny').innerHTML = '';
    document.getElementById('felhasznalok-lista').innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tab-gomb').forEach(function(gomb) {
    gomb.addEventListener('click', function() { tabMutatasa(gomb.dataset.tab, gomb); });
  });
  adminAdatokBetoltese();
});
