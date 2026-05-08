// Esemeny reszletek oldal: adatok betoltese es jelentkezes kezeles

/** URL parameterbool az esemeny azonositojanak kinyerese */
function esemenyIdKinyerese() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/** Esemeny jelentkezesi gomb megnyomasa */
async function esemenyreJelentkezes(esemenyId) {
  try {
    await apiKeres('/jelentkezesek', {
      method: 'POST',
      body: JSON.stringify({ esemeny_id: Number(esemenyId) })
    });
    alert('Sikeres jelentkezes!');
    esemenyBetoltese(); // Oldal frissitese az uj adatokkal
  } catch (hiba) {
    alert(hiba.message);
  }
}

/** Esemeny adatainak betoltese az API-bol */
async function esemenyBetoltese() {
  const tartalom = document.getElementById('esemeny-reszletek');
  const esemenyId = esemenyIdKinyerese();

  if (!esemenyId) {
    tartalom.innerHTML = '<div class="figyelmeztes hiba">Nem talalhato az esemeny azonositoja.</div>';
    return;
  }

  try {
    const esemeny = await apiKeres(`/esemenyek/${esemenyId}`);
    const bejelentkezve = beVanJelentkezve();

    tartalom.innerHTML = `
      <h1>${esemeny.cim}</h1>
      <p class="leiras">${esemeny.leiras || 'Nincs leiras.'}</p>
      <div class="reszlet-info">
        <p><strong>Datum:</strong> ${new Date(esemeny.datum).toLocaleString('hu-HU')}</p>
        <p><strong>Helyszin:</strong> ${esemeny.helyszin}</p>
        <p><strong>Szervezo:</strong> ${esemeny.szervezo_neve}</p>
        <p><strong>Jelentkezok:</strong> ${esemeny.jelentkezok_szama}${esemeny.max_resztvevok ? ' / ' + esemeny.max_resztvevok : ' (korlátlan)'}</p>
      </div>
      ${
        bejelentkezve
          ? `<button class="gomb gomb-primary" onclick="esemenyreJelentkezes(${esemeny.id})">Jelentkezem</button>`
          : `<a class="gomb gomb-primary" href="belepes.html">Bejelentkezes a jelentkezeshez</a>`
      }
    `;
  } catch (hiba) {
    tartalom.innerHTML = `<div class="figyelmeztes hiba">${hiba.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', esemenyBetoltese);
