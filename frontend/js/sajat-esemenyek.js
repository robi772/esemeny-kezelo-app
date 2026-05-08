async function jelentkezesLemondasa(jelentkezesId) {
  if (!confirm('Biztosan lemondod a jelentkezest?')) return;
  try {
    await apiKeres('/jelentkezesek/' + jelentkezesId, { method: 'DELETE' });
    sajatEsemenyekBetoltese();
  } catch (hiba) {
    alert('Hiba: ' + hiba.message);
  }
}

async function sajatEsemenyekBetoltese() {
  hitelesitesKotelezo();

  var esemenyekBox = document.getElementById('sajat-esemenyek-lista');
  var jelentkezesekBox = document.getElementById('sajat-jelentkezesek-lista');

  var allapotCimkek = { approved: 'Jovahagyott', pending: 'Fuggőben', rejected: 'Elutasitott' };
  var allapotOsztaly = { approved: 'siker', pending: 'figyelmeztes', rejected: 'hiba' };

  try {
    var eredmenyek = await Promise.all([
      apiKeres('/esemenyek/sajat'),
      apiKeres('/jelentkezesek/sajat')
    ]);
    var esemenyek = eredmenyek[0];
    var jelentkezesek = eredmenyek[1];

    esemenyekBox.innerHTML = esemenyek.length
      ? esemenyek.map(e =>
          '<div class="esemeny-kartya"><div class="esemeny-kartya-test">'
          + '<h3>' + e.title + '</h3>'
          + '<p><span class="cimke">Datum:</span> ' + new Date(e.event_date).toLocaleString('hu-HU') + '</p>'
          + '<p><span class="cimke">Helyszin:</span> ' + e.location + '</p>'
          + '<p><span class="cimke">Statusz:</span> <span class="jelveny jelveny-' + (allapotOsztaly[e.status] || '') + '">' + (allapotCimkek[e.status] || e.status) + '</span></p>'
          + '<p><span class="cimke">Jelentkezok:</span> ' + e.jelentkezok_szama + (e.max_participants ? ' / ' + e.max_participants : '') + '</p>'
          + '</div><div class="esemeny-kartya-lab">'
          + '<a class="gomb gomb-masodlagos" href="szerkesztes-esemeny.html?id=' + e.id + '">Szerkesztes</a>'
          + '<a class="gomb gomb-masodlagos" href="esemeny-reszletek.html?id=' + e.id + '">Megtekintes</a>'
          + '</div></div>'
        ).join('')
      : '<p class="halvany">Meg nincs sajat esemenyed. <a href="uj-esemeny.html">Hozz letre egyet!</a></p>';

    jelentkezesekBox.innerHTML = jelentkezesek.length
      ? jelentkezesek.map(j =>
          '<div class="esemeny-kartya"><div class="esemeny-kartya-test">'
          + '<h3>' + j.cim + '</h3>'
          + '<p><span class="cimke">Datum:</span> ' + new Date(j.esemeny_datuma).toLocaleString('hu-HU') + '</p>'
          + '<p><span class="cimke">Helyszin:</span> ' + j.helyszin + '</p>'
          + '</div><div class="esemeny-kartya-lab">'
          + '<a class="gomb gomb-masodlagos" href="esemeny-reszletek.html?id=' + j.event_id + '">Megtekintes</a>'
          + '<button class="gomb gomb-veszelyes" onclick="jelentkezesLemondasa(' + j.id + ')">Lemondas</button>'
          + '</div></div>'
        ).join('')
      : '<p class="halvany">Meg nincs jelentkezesed.</p>';
  } catch (hiba) {
    esemenyekBox.innerHTML = '<div class="figyelmeztes-hiba">Hiba: ' + hiba.message + '</div>';
    jelentkezesekBox.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', sajatEsemenyekBetoltese);
