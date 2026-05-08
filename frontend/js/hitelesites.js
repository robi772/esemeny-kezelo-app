// Hitelesítés segédfüggvények: token és felhasználó kezelés

/** Jelenleg bejelentkezett felhasználó adatainak visszaadása */
function jelenlegiFelhasznalo() {
  const adat = localStorage.getItem('felhasznalo');
  return adat ? JSON.parse(adat) : null;
}

/** Bejelentkezettsg ellenorzese */
function beVanJelentkezve() {
  return !!localStorage.getItem('token');
}

/** Bejelentkezesre atiranyitas, ha nincs token */
function bejelentkezesKotelez() {
  if (!beVanJelentkezve()) {
    window.location.href = 'belepes.html';
  }
}

/** Kijelentkezes: token es felhasznalo torlese, fooldal */
function kilepes() {
  localStorage.removeItem('token');
  localStorage.removeItem('felhasznalo');
  window.location.href = 'index.html';
}

/** Navigacios sav frissitese a bejelentkezesi allapot alapjan */
function navFrissites() {
  const navVendeg = document.getElementById('nav-vendeg');
  const navFelhasznalo = document.getElementById('nav-felhasznalo');
  const navAdmin = document.getElementById('nav-admin');
  const felhasznalo = jelenlegiFelhasznalo();

  if (navVendeg && navFelhasznalo) {
    if (felhasznalo) {
      navVendeg.style.display = 'none';
      navFelhasznalo.style.display = 'inline-flex';
    } else {
      navVendeg.style.display = 'inline-flex';
      navFelhasznalo.style.display = 'none';
    }
  }

  // Admin link csak admin szerepkoru felhasznalonak
  if (navAdmin && felhasznalo?.szerepkor === 'admin') {
    navAdmin.style.display = 'inline-flex';
  }
}

// Oldal betoltesekor navigacio frissitese
document.addEventListener('DOMContentLoaded', navFrissites);
