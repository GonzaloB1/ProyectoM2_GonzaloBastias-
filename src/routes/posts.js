const express = require('express');
const router = express.Router();

// Datos en memoria (paso intermedio antes de conectar PostgreSQL)
let posts = [
  { id: 1, title: 'Introduccion a Node.js', content: 'Node.js es un runtime de JavaScript...', author_id: 1, published: true },
  { id: 2, title: 'PostgreSQL vs MySQL', content: 'Ambas bases de datos tienen ventajas...', author_id: 2, published: true },
  { id: 3, title: 'APIs RESTful', content: 'REST es un estilo arquitectonico...', author_id: 1, published: true },
  { id: 4, title: 'Manejo de errores en Express', content: 'El manejo apropiado de errores...', author_id: 3, published: false },
  { id: 5, title: 'Async/Await explicado', content: 'Las promesas simplifican el codigo asincrono...', author_id: 3, published: false },
];

let nextId = 6;

// GET /posts
router.get('/', (req, res) => {
  res.json(posts);
});

// GET /posts/author/:authorId  ← debe ir ANTES de /:id
router.get('/author/:authorId', (req, res) => {
  const authorId = Number(req.params.authorId);
  const authorPosts = posts.filter(p => p.author_id === authorId);
  res.json(authorPosts);
});

// GET /posts/:id
router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// POST /posts
router.post('/', (req, res) => {
  const { title, content, author_id, published } = req.body;

  if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });
  if (!content || !content.trim()) return res.status(400).json({ error: 'content is required' });
  if (!author_id) return res.status(400).json({ error: 'author_id is required' });

  const newPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    author_id,
    published: published ?? false,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT /posts/:id
router.put('/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const { title, content, author_id, published } = req.body;

  if (title !== undefined) {
    if (!title.trim()) return res.status(400).json({ error: 'title cannot be empty' });
    post.title = title.trim();
  }
  if (content !== undefined) {
    if (!content.trim()) return res.status(400).json({ error: 'content cannot be empty' });
    post.content = content.trim();
  }
  if (author_id !== undefined) post.author_id = author_id;
  if (published !== undefined) post.published = published;

  res.json(post);
});

// DELETE /posts/:id
router.delete('/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Post not found' });

  posts.splice(index, 1);
  res.status(204).send();
});

module.exports = router;