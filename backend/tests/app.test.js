const request = require('supertest');
const app = require('../src/index');

jest.mock('../src/db', () => ({
  query: jest.fn()
}));

const db = require('../src/db');

describe('API Integrációs Tesztek', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/allapot visszaadja az ok státuszt', async () => {
    const res = await request(app).get('/api/allapot');
    expect(res.statusCode).toBe(200);
    expect(res.body.allapot).toBe('ok');
    expect(res.body.idopont).toBeDefined();
  });

  test('POST /api/hitelesites/regisztracio 400-at ad vissza hiányzó mezők esetén', async () => {
    const res = await request(app)
      .post('/api/hitelesites/regisztracio')
      .send({ email: 'teszt@teszt.hu' });
    expect(res.statusCode).toBe(400);
    expect(res.body.hiba).toBeDefined();
  });

  test('POST /api/hitelesites/belepes 400-at ad vissza hiányzó mezők esetén', async () => {
    const res = await request(app)
      .post('/api/hitelesites/belepes')
      .send({ email: 'teszt@teszt.hu' });
    expect(res.statusCode).toBe(400);
    expect(res.body.hiba).toBeDefined();
  });

  test('GET /api/esemenyek 500-at ad vissza DB hiba esetén', async () => {
    db.query.mockRejectedValueOnce(new Error('DB kapcsolódási hiba'));
    const res = await request(app).get('/api/esemenyek');
    expect(res.statusCode).toBe(500);
    expect(res.body.hiba).toBeDefined();
  });

  test('POST /api/jelentkezesek 401-et ad vissza token nélkül', async () => {
    const res = await request(app)
      .post('/api/jelentkezesek')
      .send({ esemeny_id: 1 });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/admin/esemenyek 401-et ad vissza token nélkül', async () => {
    const res = await request(app).get('/api/admin/esemenyek');
    expect(res.statusCode).toBe(401);
  });
});
