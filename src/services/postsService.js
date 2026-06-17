const pool = require('../db/pool');

const getAll = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM posts ORDER BY created_at DESC'
  );
  return rows;
};

const getById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM posts WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const getByAuthor = async (authorId) => {
  const { rows } = await pool.query(
    `SELECT p.*,
            a.name  AS author_name,
            a.email AS author_email,
            a.bio   AS author_bio
     FROM posts p
     JOIN authors a ON a.id = p.author_id
     WHERE p.author_id = $1
     ORDER BY p.created_at DESC`,
    [authorId]
  );
  return rows;
};

const create = async ({ title, content, author_id, published }) => {
  const { rows } = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, content, author_id, published ?? false]
  );
  return rows[0];
};

const update = async (id, { title, content, author_id, published }) => {
  const { rows } = await pool.query(
    `UPDATE posts
     SET title     = COALESCE($1, title),
         content   = COALESCE($2, content),
         author_id = COALESCE($3, author_id),
         published = COALESCE($4, published)
     WHERE id = $5
     RETURNING *`,
    [title, content, author_id, published, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM posts WHERE id = $1',
    [id]
  );
  return rowCount > 0;
};

const authorExists = async (authorId) => {
  const { rowCount } = await pool.query(
    'SELECT id FROM authors WHERE id = $1',
    [authorId]
  );
  return rowCount > 0;
};

module.exports = { getAll, getById, getByAuthor, create, update, remove, authorExists };