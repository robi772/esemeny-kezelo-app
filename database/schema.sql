-- Eseménykezelő alkalmazás adatbázis sémája
-- Futtasd ezt a szkriptet az adatbázis inicializálásához

CREATE DATABASE IF NOT EXISTS esemeny_kezelo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE esemeny_kezelo;

-- Felhasználók tábla
CREATE TABLE IF NOT EXISTS felhasznalok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  felhasznalonev VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  jelszo_hash VARCHAR(255) NOT NULL,
  szerepkor ENUM('felhasznalo', 'szervezo', 'admin') NOT NULL DEFAULT 'felhasznalo',
  letrehozva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  frissitve TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Események tábla
CREATE TABLE IF NOT EXISTS esemenyek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cim VARCHAR(255) NOT NULL,
  leiras TEXT,
  datum DATETIME NOT NULL,
  helyszin VARCHAR(255) NOT NULL,
  max_resztvevok INT DEFAULT NULL,
  szervezo_id INT NOT NULL,
  allapot ENUM('fuggoben', 'jovahagyott', 'elutasitott') NOT NULL DEFAULT 'fuggoben',
  letrehozva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  frissitve TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (szervezo_id) REFERENCES felhasznalok(id) ON DELETE CASCADE
);

-- Jelentkezések tábla
CREATE TABLE IF NOT EXISTS jelentkezesek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  felhasznalo_id INT NOT NULL,
  esemeny_id INT NOT NULL,
  jelentkezve TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY egyedi_jelentkezes (felhasznalo_id, esemeny_id),
  FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(id) ON DELETE CASCADE,
  FOREIGN KEY (esemeny_id) REFERENCES esemenyek(id) ON DELETE CASCADE
);

-- Indexek a gyorsabb lekérdezésekhez
CREATE INDEX idx_esemenyek_allapot ON esemenyek(allapot);
CREATE INDEX idx_esemenyek_datum ON esemenyek(datum);
CREATE INDEX idx_esemenyek_szervezo ON esemenyek(szervezo_id);
CREATE INDEX idx_jelentkezesek_felhasznalo ON jelentkezesek(felhasznalo_id);
CREATE INDEX idx_jelentkezesek_esemeny ON jelentkezesek(esemeny_id);

-- Seed adat: alapértelmezett admin felhasználó
-- Jelszó: password
INSERT INTO felhasznalok (felhasznalonev, email, jelszo_hash, szerepkor)
VALUES (
  'admin',
  'admin@esemenykezelo.local',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'admin'
);

-- Seed adat: demo szervező felhasználó
-- Jelszó: password
INSERT INTO felhasznalok (felhasznalonev, email, jelszo_hash, szerepkor)
VALUES (
  'demo_szervezo',
  'szervezo@esemenykezelo.local',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'szervezo'
);

-- Seed adat: demo rendezvények
INSERT INTO esemenyek (cim, leiras, datum, helyszin, max_resztvevok, szervezo_id, allapot)
VALUES
  ('Tech Meetup Budapest 2026', 'Évi tech találkozó Budapest szívében. Előadások, networking és sok érdekesség!', '2026-09-15 18:00:00', 'Budapest, Akvárium Klub', 200, 2, 'jovahagyott'),
  ('React Workshop', 'Haladó React fejlesztés: hooks, context, teljesítmény optimalizálás.', '2026-10-05 10:00:00', 'Budapest, Teleki tér 8.', 30, 2, 'jovahagyott'),
  ('Robotika Bemutató Nap', 'Autonóm robotok bemutatója és közönség interakció.', '2026-11-20 14:00:00', 'Budapest, BME Q épület', 100, 2, 'jovahagyott');
