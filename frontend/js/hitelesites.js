function getJelenlegiFelhasznalo() {
  const raw = localStorage.getItem('felhasznalo');
  return raw ? JSON.parse(raw) : null;
}

function beVanLepve() {
  return !!localStorage.getItem('token');
}

function hitelesitesKotelezo() {
  if (!beVanLepve()) {
    window.location.href = 'belepes.html';
  }
}

function isAdmin(felhasznalo) {
  if (!felhasznalo) return false;
  return felhasznalo.szerepkor === 'admin' || felhasznalo.role === 'admin';
}

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

  if (navAdmin && isAdmin(felhasznalo)) {
    navAdmin.style.display = 'inline-flex';
  }
}

document.addEventListener('DOMContentLoaded', navigacioFrissitese);
