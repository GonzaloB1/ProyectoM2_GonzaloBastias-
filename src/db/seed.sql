INSERT INTO authors (name, email, bio) VALUES
  ('Ana Garcia',  'ana@example.com',    'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor tecnico especializado en bases de datos'),
  ('Maria Lopez', 'maria@example.com',  'Ingeniera de software con foco en APIs REST')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (title, content, author_id, published)
SELECT * FROM (VALUES
  ('Introduccion a Node.js',        'Node.js es un runtime de JavaScript...', 1, true),
  ('PostgreSQL vs MySQL',           'Ambas bases de datos tienen ventajas...', 2, true),
  ('APIs RESTful',                  'REST es un estilo arquitectonico...',     1, true),
  ('Manejo de errores en Express',  'El manejo apropiado de errores...',       3, false),
  ('Async/Await explicado',         'Las promesas simplifican el codigo...',   1, false)
) AS v(title, content, author_id, published)
WHERE NOT EXISTS (
  SELECT 1 FROM posts WHERE posts.title = v.title
);