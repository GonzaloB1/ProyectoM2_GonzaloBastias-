const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  if (err.code === '23505') {
    return res.status(400).json({ error: 'Duplicate value violates unique constraint' });
  }

  
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource does not exist' });
  }

 
  if (err.code === '23502') {
    return res.status(400).json({ error: 'Missing required field' });
  }

  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;