require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');

let createdAuthorId;
let createdPostId;

afterAll(async () => {
  if (createdPostId) await pool.query('DELETE FROM posts WHERE id = $1', [createdPostId]);
  if (createdAuthorId) await pool.query('DELETE FROM authors WHERE id = $1', [createdAuthorId]);
  await pool.end();
});

describe('POST /authors', () => {
  test('crea un author correctamente -> 201', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Test User', email: `test_${Date.now()}@example.com`, bio: 'Bio de prueba' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');

    createdAuthorId = res.body.id;
  });

  test('falla sin name -> 400', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ email: 'noname@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('falla sin email -> 400', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Sin Email' });

    expect(res.status).toBe(400);
  });

  test('falla con email duplicado -> 400', async () => {
    const email = `dup_${Date.now()}@example.com`;
    await request(app).post('/authors').send({ name: 'Primero', email });

    const res = await request(app)
      .post('/authors')
      .send({ name: 'Segundo', email });

    expect(res.status).toBe(400);

    const { rows } = await pool.query('SELECT id FROM authors WHERE email = $1', [email]);
    if (rows[0]) await pool.query('DELETE FROM authors WHERE id = $1', [rows[0].id]);
  });
});

describe('GET /authors', () => {
  test('devuelve lista de authors -> 200', async () => {
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /authors/:id', () => {
  test('devuelve author existente -> 200', async () => {
    const res = await request(app).get(`/authors/${createdAuthorId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdAuthorId);
  });

  test('devuelve 404 para author inexistente', async () => {
    const res = await request(app).get('/authors/999999');
    expect(res.status).toBe(404);
  });
});

describe('POST /posts', () => {
  test('crea un post correctamente -> 201', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Post de test', content: 'Contenido de prueba', author_id: createdAuthorId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Post de test');

    createdPostId = res.body.id;
  });

  test('falla sin title -> 400', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ content: 'Algo', author_id: createdAuthorId });

    expect(res.status).toBe(400);
  });

  test('falla sin content -> 400', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Algo', author_id: createdAuthorId });

    expect(res.status).toBe(400);
  });

  test('falla sin author_id -> 400', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Algo', content: 'Algo' });

    expect(res.status).toBe(400);
  });

  test('falla con author inexistente -> 404', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'X', content: 'Y', author_id: 999999 });

    expect(res.status).toBe(404);
  });
});

describe('GET /posts', () => {
  test('devuelve lista de posts -> 200', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /posts/:id', () => {
  test('devuelve post existente -> 200', async () => {
    const res = await request(app).get(`/posts/${createdPostId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPostId);
  });

  test('devuelve 404 para post inexistente', async () => {
    const res = await request(app).get('/posts/999999');
    expect(res.status).toBe(404);
  });
});

describe('GET /posts/author/:authorId', () => {
  test('devuelve posts con detalle del author -> 200', async () => {
    const res = await request(app).get(`/posts/author/${createdAuthorId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('author_name');
    }
  });

  test('devuelve 404 si el author no existe', async () => {
    const res = await request(app).get('/posts/author/999999');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /posts/:id - recurso inexistente', () => {
  test('devuelve 404 al eliminar post que no existe', async () => {
    const res = await request(app).delete('/posts/999999');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /authors/:id - recurso inexistente', () => {
  test('devuelve 404 al eliminar author que no existe', async () => {
    const res = await request(app).delete('/authors/999999');
    expect(res.status).toBe(404);
  });
});