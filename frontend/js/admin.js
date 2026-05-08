function tabMutatasa(tab, gomb) {
  document.querySelectorAll('.tab-tartalom').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-gomb').forEach(el => el.classList.remove('aktiv'));
  document.getElementById(`tab-${tab}`).style.display = 'block';
  if (gomb) gomb.classList.add('aktiv');
}

async function esemenyAllapotFrissitese(id, allapot) {
  const cimke = allapot === 'approved' ? 'jóváhagyod' : 'elutasítod';
  if (!confirm(`Biztosan ${cimke} ezt az eseményt?`)) return;
  try {
    await apiKeres(`/admin/esemenyek/${id}/allapot`, {
      method: 'PATCH',
      body: JSON.stringify({ allapot })
    });
    adminAdatokBetoltese();
  } catch (hiba) {
    alert('Hiba: ' + hiba.message);
  }
}

async function esemenyTörlése(id) {
  if (!confirm('Biztosan törlöd ezt az eseményt? Ez a művelet nem vonható vissza.')) return;
  try {
    await apiKeres(`/admin/esemenyek/${id}`, { method: 'DELETE' });
    adminAdatokBetoltese();
  } catch (hiba) {
    alert('Hiba: ' + hiba.message);
  }
}

async function adminAdatokBetoltese() {
  hitelesitesKotelező();
  const felhasznalo = getJelenlegiFelhasznalo();
  if (felhasznalo?.szerepkor !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  const allapotCimkek = { approved: '✓ Jóváhagyott', pending: '⏳ Függőben', rejected: '✗ Elutasított' };
  const allapotOsztaly = { approved: 'siker', pending: 'figyelmeztes', rejected: 'hiba' };

  try {
    const [esemenyek, felhasznalok] = await Promise.all([
      apiKeres('/admin/esemenyek'),
      apiKeres('/admin/felhasznalok')
    ]);

    const fuggoBen = esemenyek.filter(e => e.status === 'pending');

    document.getElementById('fuggoben-esemenyek').innerHTML = fuggoBen.length
      ? fuggoBen.map(e => `
        <div class="esemeny-kartya">
          <div class="esemeny-kartya-test">
            <h3>${e.title}</h3>
            <p><span class="cimke">📍 Helyszín:</span> ${e.location}</p>
            <p><span class="cimke">📅 Dátum:</span> ${new Date(e.event_date).toLocaleString('hu-HU')}</p>
            <p><span class="cimke">👤 Szervező:</span> ${e.szervezo_neve}</p>
          </div>
          <div class="esemeny-kartya-lab">
            <button class="gomb gomb-elsdleges" onclick="esemenyAllapotFrissitese(${e.id}, 'approved')">✓ Jóváhagyás</button>
            <button class="gomb gomb-masodlagos" onclick="esemenyAllapotFrissitese(${e.id}, 'rejected')">✗ Elutasítás</button>
          </div>
        </div>
      `).join('')
      : '<p class="halvany">Nincs függőben lévő esemény.</p>';

    document.getElementById('osszes-esemeny').innerHTML = esemenyek.length
      ? esemenyek.map(e => `
        <div class="esemeny-kartya">
          <div class="esemeny-kartya-test">
            <h3>${e.title}</h3>
            <p><span class="cimke">📌 Státusz:</span> <span class="jelveny jelveny-${allapotOsztaly[e.status]}">${allapotCimkek[e.status] || e.status}</span></p>
            <p><span class="cimke">👤 Szervező:</span> ${e.szervezo_neve}</p>
            <p><span class="cimke">📅 Dátum:</span> ${new Date(e.event_date).toLocaleString('hu-HU')}</p>
          </div>
          <div class="esemeny-kartya-lab">
            <button class="gomb gomb-veszelyes" onclick="esemenyTörlése(${e.id})">🗑 Törlés</button>
          </div>
        </div>
      `).join('')
      : '<p class="halvany">Nincs esemény.</p>';

    document.getElementById('felhasznalok-lista').innerHTML = felhasznalok.length
      ? felhasznalok.map(f => `
        <div class="esemeny-kartya">
          <div class="esemeny-kartya-test">
            <h3>${f.username}</h3>
            <p>${f.email}</p>
            <p><span class="cimke">Szerepkör:</span> ${f.role}</p>
            <p><span class="cimke">Regisztrált:</span> ${new Date(f.created_at).toLocaleDateString('hu-HU')}</p>
          </div>
        </div>
      `).join('')
      : '<p class="halvany">Nincs felhasználó.</p>';

  } catch (hiba) {
    document.getElementById('fuggoben-esemenyek').innerHTML = `<div class="figyelmeztetés figyelmeztetés-hiba">Hiba: ${hiba.message}</div>`;
    document.getElementById('osszes-esemeny').innerHTML = '';
    document.getElementById('felhasznalok-lista').innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-gomb').forEach(gomb => {
    gomb.addEventListener('click', () => tabMutatasa(gomb.dataset.tab, gomb));
  });
  adminAdatokBetoltese();
});
