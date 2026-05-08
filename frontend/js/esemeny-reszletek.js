function getEsemenyId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function jelentkezesEsemenyre(esemenyId) {
  const gomb = document.getElementById('jelentkezes-gomb');
  if (gomb) { gomb.disabled = true; gomb.textContent = 'Jelentkezés...'; }

  try {
    await apiKeres('/jelentkezesek', {
      method: 'POST',
      body: JSON.stringify({ esemeny_id: Number(esemenyId) })
    });
    alert('Sikeres jelentkezés! Viszlát az eseményen.');
    esemenyBetoltese();
  } catch (hiba) {
    const uzenet = hiba.message === 'Already registered for this event'
      ? 'Már jelentkeztél erre az eseményre.'
      : hiba.message === 'Event is full'
      ? 'Az esemény betelt, sajnos nem tudsz jelentkezni.'
      : hiba.message;
    alert(uzenet);
    if (gomb) { gomb.disabled = false; gomb.textContent = 'Jelentkezem'; }
  }
}

async function esemenyBetoltese() {
  const tartalom = document.getElementById('esemeny-reszletek');
  const esemenyId = getEsemenyId();

  if (!esemenyId) {
    tartalom.innerHTML = '<div class="figyelmeztetés figyelmeztetés-hiba">Nem található az esemény azonosítója.</div>';
    return;
  }

  try {
    const esemeny = await apiKeres(`/esemenyek/${esemenyId}`);
    const belepve = beVanLepve();
    const allapotCimkek = { approved: 'Jóváhagyott', pending: 'Függőben', rejected: 'Elutasított' };

    tartalom.innerHTML = `
      <h1>${esemeny.title}</h1>
      <p class="esemeny-leiras">${esemeny.description || 'Nincs leírás.'}</p>
      <div class="reszlet-racs">
        <p><span class="cimke">📅 Dátum:</span> ${new Date(esemeny.event_date).toLocaleString('hu-HU')}</p>
        <p><span class="cimke">📍 Helyszín:</span> ${esemeny.location}</p>
        <p><span class="cimke">👤 Szervező:</span> ${esemeny.szervezo_neve}</p>
        <p><span class="cimke">👥 Jelentkezők:</span> ${esemeny.jelentkezok_szama}${esemeny.max_participants ? ' / ' + esemeny.max_participants + ' fő' : ''}</p>
        <p><span class="cimke">📌 Státusz:</span> ${allapotCimkek[esemeny.status] || esemeny.status}</p>
      </div>
      <div style="margin-top:1.5rem">
        ${belepve
          ? `<button id="jelentkezes-gomb" class="gomb gomb-elsdleges" onclick="jelentkezesEsemenyre(${esemeny.id})">Jelentkezem</button>`
          : `<a class="gomb gomb-elsdleges" href="belepes.html">Belépés a jelentkezéshez</a>`
        }
        <a class="gomb gomb-masodlagos" href="index.html">← Vissza</a>
      </div>
    `;
  } catch (hiba) {
    tartalom.innerHTML = `<div class="figyelmeztetés figyelmeztetés-hiba">Hiba: ${hiba.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', esemenyBetoltese);
