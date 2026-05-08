async function jelentkezesLemondasa(jelentkezesId) {
  if (!confirm('Biztosan lemondod a jelentkezést?')) return;
  try {
    await apiKeres(`/jelentkezesek/${jelentkezesId}`, { method: 'DELETE' });
    sajatEsemenyekBetoltese();
  } catch (hiba) {
    alert('Hiba: ' + hiba.message);
  }
}

async function sajatEsemenyekBetoltese() {
  hitelesitesKotelező();

  const esemenyekBox = document.getElementById('sajat-esemenyek-lista');
  const jelentkezesekBox = document.getElementById('sajat-jelentkezesek-lista');

  const allapotCimkek = { approved: '✓ Jóváhagyott', pending: '⏳ Függőben', rejected: '✗ Elutasított' };
  const allapotOsztaly = { approved: 'siker', pending: 'figyelmeztes', rejected: 'hiba' };

  try {
    const [esemenyek, jelentkezesek] = await Promise.all([
      apiKeres('/esemenyek/sajat'),
      apiKeres('/jelentkezesek/sajat')
    ]);

    esemenyekBox.innerHTML = esemenyek.length
      ? esemenyek.map(e => `
        <div class="esemeny-kartya">
          <div class="esemeny-kartya-test">
            <h3>${e.title}</h3>
            <p><span class="cimke">📅 Dátum:</span> ${new Date(e.event_date).toLocaleString('hu-HU')}</p>
            <p><span class="cimke">📍 Helyszín:</span> ${e.location}</p>
            <p><span class="cimke">📌 Státusz:</span> <span class="jelveny jelveny-${allapotOsztaly[e.status]}">${allapotCimkek[e.status] || e.status}</span></p>
            <p><span class="cimke">👥 Jelentkezők:</span> ${e.jelentkezok_szama}${e.max_participants ? ' / ' + e.max_participants : ''}</p>
          </div>
          <div class="esemeny-kartya-lab">
            <a class="gomb gomb-masodlagos" href="szerkesztes-esemeny.html?id=${e.id}">✎ Szerkesztés</a>
            <a class="gomb gomb-masodlagos" href="esemeny-reszletek.html?id=${e.id}">Megtekintés</a>
          </div>
        </div>
      `).join('')
      : '<p class="halvany">Még nincs saját eseményed. <a href="uj-esemeny.html">Hozz létre egyet!</a></p>';

    jelentkezesekBox.innerHTML = jelentkezesek.length
      ? jelentkezesek.map(j => `
        <div class="esemeny-kartya">
          <div class="esemeny-kartya-test">
            <h3>${j.cim}</h3>
            <p><span class="cimke">📅 Dátum:</span> ${new Date(j.esemeny_datuma).toLocaleString('hu-HU')}</p>
            <p><span class="cimke">📍 Helyszín:</span> ${j.helyszin}</p>
          </div>
          <div class="esemeny-kartya-lab">
            <a class="gomb gomb-masodlagos" href="esemeny-reszletek.html?id=${j.event_id}">Megtekintés</a>
            <button class="gomb gomb-veszelyes" onclick="jelentkezesLemondasa(${j.id})">Lemondás</button>
          </div>
        </div>
      `).join('')
      : '<p class="halvany">Még nincs jelentkezésed.</p>';
  } catch (hiba) {
    esemenyekBox.innerHTML = `<div class="figyelmeztetés figyelmeztetés-hiba">Hiba: ${hiba.message}</div>`;
    jelentkezesekBox.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', sajatEsemenyekBetoltese);
