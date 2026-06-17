const express = require('express');
const router = express.Router();
const svc = require('../services/authorsService');


router.get('/', async (req, res, next) => {
  try {
    const authors = await svc.getAll();
    res.json(authors);
  } catch (err) { next(err); }
});


router.get('/:id', async (req, res, next) => {
  try {
    const author = await svc.getById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.json(author);
  } catch (err) { next(err); }
});


router.post('/', async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'email is required' });

    if (await svc.emailExists(email)) {
      return res.status(400).json({ error: 'email already in use' });
    }

    const author = await svc.create({ name: name.trim(), email: email.trim(), bio });
    res.status(201).json(author);
  } catch (err) { next(err); }
});


router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    const { id } = req.params;

    const existing = await svc.getById(id);
    if (!existing) return res.status(404).json({ error: 'Author not found' });

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ error: 'name cannot be empty' });
    }
    if (email !== undefined) {
      if (!email.trim()) return res.status(400).json({ error: 'email cannot be empty' });
      if (await svc.emailExists(email, id)) {
        return res.status(400).json({ error: 'email already in use' });
      }
    }

    const updated = await svc.update(id, { name, email, bio });
    res.json(updated);
  } catch (err) { next(err); }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await svc.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Author not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;