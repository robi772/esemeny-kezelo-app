# 🎫 Eseménykezelő Alkalmazás

Egy teljes eseménykezelő webalkalmazás Node.js backenddel, vanilla JavaScript frontenddel és MySQL adatbázissal. Docker-alapú deploymenttel.

![Verzió](https://img.shields.io/badge/verzió-1.0.0-blue.svg) ![Licence](https://img.shields.io/badge/licence-MIT-green.svg) ![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)

---

## 📌 Tartalomjegyzék

- [Funkciók](#funkciók)
- [Rendszerigények](#rendszerigények)
- [Indítás](#indítás)
  - [Dockerrel](#dockerrel)
  - [Kézi fejlesztéshez](#kézi-fejlesztéshez)
- [API dokumentáció](#api-dokumentáció)
- [Projekt struktúra](#projekt-struktúra)
- [Tesztelés](#tesztelés)

---

## 🚀 Funkciók

- **Regisztráció és belépés** – JWT token alapú hitelesítés
- **Események böngészése** – jóváhagyott események listája
- **Új esemény létrehozása** – jóváhagyásra vár
- **Jelentkezés** eseményre, lemondás lehetősége
- **Saját események** panel – saját események és jelentkezések kezelése
- **Esemény szerkesztése** – adatok módosítása
- **Admin felület** – jóváhagyás, elutasítás, törlés, felhasználók listája
- **Docker-alapú deployment** ad hoc indítással

---

## 📋 Rendszerigények

- [Docker](https://www.docker.com) + [Docker Compose](https://docs.docker.com/compose/)
- [Node.js 18+](https://nodejs.org) (fejlesztéshez)
- [MySQL 8.0+](https://www.mysql.com)

---

## ⚡ Indítás

### Dockerrel

Ez egyúttal a leggyorsabb módszer.

1. Klónozd a repót:
   ```bash
   git clone https://github.com/robi772/esemeny-kezelo-app.git
   cd esemeny-kezelo-app
   ```

2. Indítsd Dockerrel:
   ```bash
   docker compose up --build
   ```

3. Nyisd meg a böngészőben:
   ```
   http://localhost:8080
   ```

> Az adatbázis és demo adatok automatikusan létrejönnek. Demo belépési adatok:
> - Admin: `admin@esemenykezelo.local` / `password`
> - Szervező: `szervezo@esemenykezelo.local` / `password`

### Kézi fejlesztéshez

1. Telepítsd a függőségeket:
   ```bash
   cd backend && npm install
   ```

2. Hozz létre `.env` fájlt:
   ```bash
   cp backend/.env.example backend/.env
   # Szerkeszd meg az adatbázis adatokat szükség szerint
   ```

3. Indítsd a backendet:
   ```bash
   cd backend && npm run dev
   ```

4. Nyisd meg a frontendet egy webszerverrel (pl. Live Server VS Code bővítményben).

---

## 📂 API dokumentáció

### Hitelesítés

| Módszer | Végpont | Leírás |
| --- | --- | --- |
| POST | `/api/hitelesites/regisztracio` | Regisztráció |
| POST | `/api/hitelesites/belepes` | Belépés |

### Események

| Módszer | Végpont | Leírás |
| --- | --- | --- |
| GET | `/api/esemenyek` | Jóváhagyott események listája |
| GET | `/api/esemenyek/sajat` | Saját események (token kell) |
| GET | `/api/esemenyek/:id` | Esemény részletei |
| POST | `/api/esemenyek` | Új esemény létrehozása (token kell) |
| PUT | `/api/esemenyek/:id` | Esemény szerkesztése |

### Jelentkezések

| Módszer | Végpont | Leírás |
| --- | --- | --- |
| POST | `/api/jelentkezesek` | Eseményre való jelentkezés |
| DELETE | `/api/jelentkezesek/:id` | Jelentkezés lemondása |
| GET | `/api/jelentkezesek/sajat` | Saját jelentkezések |
| GET | `/api/jelentkezesek/esemeny/:esemenyId` | Esemény résztvevői (szervező) |

### Admin

| Módszer | Végpont | Leírás |
| --- | --- | --- |
| GET | `/api/admin/esemenyek` | Összes esemény listája |
| PATCH | `/api/admin/esemenyek/:id/allapot` | Jóváhagyás / elutasítás |
| DELETE | `/api/admin/esemenyek/:id` | Esemény törlése |
| GET | `/api/admin/felhasznalok` | Felhasználó lista |

---

## 📁 Projekt struktúra

```
esemeny-kezelo-app/
│
├── backend/
│   ├── src/
│   │   ├── db.js                    # Adatbázis kapcsolat
│   │   ├── index.js                 # Szerver belépési pont
│   │   ├── middleware/
│   │   │   └── hitelesites.js       # JWT ellenőrzés
│   │   └── routes/
│   │       ├── hitelesites.js
│   │       ├── esemenyek.js
│   │       ├── jelentkezesek.js
│   │       └── admin.js
│   ├── tests/
│   │   └── app.test.js              # Integrációs tesztek
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── schema.sql                   # Adatbázis séma + demo adatok
│
├── frontend/
│   ├── css/stilus.css
│   ├── index.html                   # Főoldal
│   ├── belepes.html
│   ├── regisztracio.html
│   ├── esemeny-reszletek.html
│   ├── uj-esemeny.html
│   ├── sajat-esemenyek.html
│   ├── szerkesztes-esemeny.html
│   ├── admin.html
│   └── js/
│       ├── api.js
│       ├── hitelesites.js
│       ├── fooldal.js
│       ├── belepes.js
│       ├── regisztracio.js
│       ├── esemeny-reszletek.js
│       ├── uj-esemeny.js
│       ├── sajat-esemenyek.js
│       ├── szerkesztes-esemeny.js
│       └── admin.js
│
├── docker-compose.yml
├── nginx.conf
├── .gitignore
└── README.md
```

---

## 🧪 Tesztelés

```bash
cd backend
npm test
```

---

## 📅 Fejlesztési terv

- [ ] E-mail értesítés jelentkezésután
- [ ] Esemény szűrés / kategória
- [ ] Felhasználói profil szerkesztése
- [ ] Admin statisztikai dashboard
- [ ] Responsive mobil nézet fejlesztése

---

## 📝 Licenc

[MIT](LICENSE) Copyright © 2026
