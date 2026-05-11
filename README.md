# 🎫 Eseménykezelő Alkalmazás

Egy eseménykezelő webalkalmazás Node.js backenddel,  JavaScript frontenddel és MySQL adatbázissal. Docker-alapú deploymenttel.


---

## 📌 Tartalomjegyzék

- [🎫 Eseménykezelő Alkalmazás](#-eseménykezelő-alkalmazás)
  - [📌 Tartalomjegyzék](#-tartalomjegyzék)
  - [🚀 Funkciók](#-funkciók)
  - [📋 Rendszerigények](#-rendszerigények)
  - [⚡ Indítás](#-indítás)
    - [Dockerrel](#dockerrel)
  - [📂 API dokumentáció](#-api-dokumentáció)
    - [Hitelesítés](#hitelesítés)
    - [Események](#események)
    - [Jelentkezések](#jelentkezések)
    - [Admin](#admin)
  - [📁 Projekt struktúra](#-projekt-struktúra)
  - [🧪 Tesztelés](#-tesztelés)

---

## 🚀 Funkciók

- **Regisztráció és belépés** – JWT token alapú hitelesítés
- **Események böngészése** – jóváhagyott események listája
- **Új esemény létrehozása** – jóváhagyásra vár
- **Jelentkezés** eseményre, lemondás lehetősége
- **Saját események** panel – saját események és jelentkezések kezelése
- **Esemény szerkesztése** – adatok módosítása
- **Admin felület** – jóváhagyás, elutasítás, törlés, felhasználók listája

---

## 📋 Rendszerigények

- [Docker](https://www.docker.com) + [Docker Compose](https://docs.docker.com/compose/)
- [Node.js 18+](https://nodejs.org) (fejlesztéshez)
- [MySQL 8.0+](https://www.mysql.com)

---

## ⚡ Indítás

### Dockerrel


1. Indítsd Dockerrel:
   ```bash
   docker compose up --build
   ```

2. Nyisd meg a böngészőben:
   ```
   http://localhost:8080
   ```

> Az adatbázis és demo adatok automatikusan létrejönnek. Demo belépési adatok:
> - Admin: `admin@esemenykezelo.local` / `password`
> - Szervező: `szervezo@esemenykezelo.local` / `password`


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

