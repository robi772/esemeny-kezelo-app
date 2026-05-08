function getJelenlegiFelhasznalo() {
  const raw = localStorage.getItem('felhasznalo');
  return raw ? JSON.parse(raw) : null;
}

function beVanLepve() {
  return !!localStorage.getItem('token');
}

function hitelesitesKotelező() {
  if (!beVanLepve()) {
    window.location.href = 'belepes.html';
  }
}

// alias ékezet nélkül is működjön
function hitelesitesKotelező() { hitelesitesKotelező(); }

function kilepes() {
  localStorage.removeItem('token');
  localStorage.removeItem('felhasznalo');
  window.location.href = 'index.html';
}

function navigacioFrissitese() {
  const navHitelesites = document.getElementById('nav-hitelesites');
  const navFelhasznalo = document.getElementById('nav-felhasznalo');
  const navAdmin = document.getElementById('nav-admin');
  const felhasznalo = getJelenlegiFelhasznalo();

  if (navHitelesites && navFelhasznalo) {
    if (felhasznalo) {
      navHitelesites.style.display = 'none';
      navFelhasznalo.style.display = 'inline-flex';
    } else {
      navHitelesites.style.display = 'inline-flex';
      navFelhasznalo.style.display = 'none';
    }
  }

  if (navAdmin && (felhasznalo?.szerepkor === 'admin' || felhasznalo?.role === 'admin')) {
    navAdmin.style.display = 'inline-flex';
  }
}

document.addEventListener('DOMContentLoaded', navigacioFrissitese);
