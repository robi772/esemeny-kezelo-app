-- Esemenykezelo Adatbazis Schema
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS esemeny_kezelo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE esemeny_kezelo;

-- Felhasznalok tabla
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'organizer', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Esemenyek tabla
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  event_date DATETIME NOT NULL,
  location VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  max_participants INT DEFAULT NULL,
  organizer_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Jelentkezesek tabla
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY egyedi_jelentkezes (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Indexek
CREATE INDEX idx_esemenyek_allapot ON events(status);
CREATE INDEX idx_esemenyek_datum ON events(event_date);
CREATE INDEX idx_esemenyek_szervezo ON events(organizer_id);
CREATE INDEX idx_jelentkezesek_felhasznalo ON registrations(user_id);
CREATE INDEX idx_jelentkezesek_esemeny ON registrations(event_id);

-- Admin felhasznalo (jelszo: password)
INSERT INTO users (username, email, password_hash, role) VALUES (
  'admin',
  'admin@esemenykezelo.local',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'admin'
);

-- Demo szervezo (jelszo: password)
INSERT INTO users (username, email, password_hash, role) VALUES (
  'demo_szervezo',
  'szervezo@esemenykezelo.local',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'organizer'
);

-- Demo esemenyek
INSERT INTO events (title, description, event_date, location, max_participants, organizer_id, status) VALUES
  ('Tech Meetup Budapest 2026', 'Évi tech találkozó Budapest szívében. Előadások, networking és sok érdekesség!', '2026-09-15 18:00:00', 'Budapest, Akvárium Klub', 200, 2, 'approved'),
  ('React Workshop', 'Haladó React fejlesztés: hooks, context, performance optimalizálás.', '2026-10-05 10:00:00', 'Budapest, Teleki tér 8.', 30, 2, 'approved'),
  ('Robotics Demo Nap', 'Autonóm robotok bemutatója és közönség interakció.', '2026-11-20 14:00:00', 'Budapest, BME Q épület', 100, 2, 'approved');
