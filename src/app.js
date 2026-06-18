const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({
    message: 'MiniBlog API',
    health: '/health',
    docs: '/api-docs',
    endpoints: {
      authors: '/authors',
      posts: '/posts',
      postsByAuthor: '/posts/author/:authorId'
    }
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use(errorHandler);

module.exports = app;