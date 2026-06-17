const express = require('express');
const router = express.Router();
const svc = require('../services/postsService');


router.get('/', async (req, res, next) => {
  try {
    const posts = await svc.getAll();
    res.json(posts);
  } catch (err) { next(err); }
});


router.get('/author/:authorId', async (req, res, next) => {
  try {
    const exists = await svc.authorExists(req.params.authorId);
    if (!exists) return res.status(404).json({ error: 'Author not found' });

    const posts = await svc.getByAuthor(req.params.authorId);
    res.json(posts);
  } catch (err) { next(err); }
});


router.get('/:id', async (req, res, next) => {
  try {
    const post = await svc.getById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
});


router.post('/', async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;

    if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });
    if (!content || !content.trim()) return res.status(400).json({ error: 'content is required' });
    if (!author_id) return res.status(400).json({ error: 'author_id is required' });

    const authorOk = await svc.authorExists(author_id);
    if (!authorOk) return res.status(404).json({ error: 'Author not found' });

    const post = await svc.create({ title: title.trim(), content: content.trim(), author_id, published });
    res.status(201).json(post);
  } catch (err) { next(err); }
});


router.put('/:id', async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;
    const { id } = req.params;

    const existing = await svc.getById(id);
    if (!existing) return res.status(404).json({ error: 'Post not found' });

    if (title !== undefined && !title.trim()) return res.status(400).json({ error: 'title cannot be empty' });
    if (content !== undefined && !content.trim()) return res.status(400).json({ error: 'content cannot be empty' });

    if (author_id !== undefined) {
      const authorOk = await svc.authorExists(author_id);
      if (!authorOk) return res.status(404).json({ error: 'Author not found' });
    }

    const updated = await svc.update(id, { title, content, author_id, published });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await svc.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;