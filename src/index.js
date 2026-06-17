require('dotenv').config();
const app = require('./app');
const pool = require('./db/pool');

const PORT = process.env.PORT || 3000;

pool.connect()
  .then(client => {
    client.release();
    console.log('Connected to PostgreSQL');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Could not connect to PostgreSQL:', err.message);
    process.exit(1);
  });
  