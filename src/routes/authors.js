const express = require('express');
const router = express.Router();

// Datos en memoria (paso intermedio antes de conectar PostgreSQL)
let authors = [
  {
    id: 1,
    name: 'Ana Garcia',
    email: 'ana@example.com',
    bio: 'Desarrolladora full-stack apasionada por Node.js',
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    email: 'carlos@example.com',
    bio: 'Escritor tecnico especializado en bases de datos',
  },
  {
    id: 3,
    name: 'Maria Lopez',
    email: 'maria@example.com',
    bio: 'Ingeniera de software con foco en APIs REST',
  },
];

let nextId = 4;

// GET /authors
router.get('/', (req, res) => {
  res.json(authors);
});

// GET /authors/:id
router.get('/:id', (req, res) => {
  const author = authors.find(a => a.id === Number(req.params.id));
  if (!author) return res.status(404).json({ error: 'Author not found' });
  res.json(author);
});

// POST /authors
router.post('/', (req, res) => {
  const { name, email, bio } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' });
  if (!email || !email.trim()) return res.status(400).json({ error: 'email is required' });
  if (authors.some(a => a.email === email)) {
    return res.status(400).json({ error: 'email already in use' });
  }

  const newAuthor = { id: nextId++, name: name.trim(), email: email.trim(), bio: bio || null };
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

// PUT /authors/:id
router.put('/:id', (req, res) => {
  const author = authors.find(a => a.id === Number(req.params.id));
  if (!author) return res.status(404).json({ error: 'Author not found' });

  const { name, email, bio } = req.body;

  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ error: 'name cannot be empty' });
    author.name = name.trim();
  }
  if (email !== undefined) {
    if (!email.trim()) return res.status(400).json({ error: 'email cannot be empty' });
    if (authors.some(a => a.email === email && a.id !== author.id)) {
      return res.status(400).json({ error: 'email already in use' });
    }
    author.email = email.trim();
  }
  if (bio !== undefined) author.bio = bio;

  res.json(author);
});

// DELETE /authors/:id
router.delete('/:id', (req, res) => {
  const index = authors.findIndex(a => a.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Author not found' });

  authors.splice(index, 1);
  res.status(204).send();
});

module.exports = router;