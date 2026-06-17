# MiniBlog API

API REST para gestionar autores y posts, desarrollada con Node.js + Express 5 + PostgreSQL.

## Stack

- Node.js v18+
- Express 5
- PostgreSQL v15+ (driver `pg`)
- Jest + Supertest (testing)
- OpenAPI (documentación)

## Instalación y ejecución local

1. Clonar el repositorio:
```bash
   git clone https://github.com/GonzaloB1/ProyectoM2_GonzaloBastias-.git
   cd ProyectoM2_GonzaloBastias-
```

2. Instalar dependencias:
```bash
   npm install
```

3. Crear la base de datos local:
```bash
   psql -U postgres -c "CREATE DATABASE miniblog"
```

4. Crear las tablas:
```bash
   psql -U postgres -d miniblog -f src/db/schema.sql
```

5. Cargar datos de prueba:
```bash
   psql -U postgres -d miniblog -f src/db/seed.sql
```

6. Configurar variables de entorno:
```bash
   cp .env.example .env
   # Editar .env con tus credenciales
```

7. Iniciar el servidor:
```bash
   npm start
```

El servidor corre en http://localhost:3000

## Variables de entorno

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
DB_USER=postgres
DB_PASSWORD=tu_contraseña
NODE_ENV=development
```

## Ejecutar tests

```bash
npm test
```

19/19 tests pasando (Jest + Supertest).

## Endpoints disponibles

### Health
- GET    /health

### Authors
- GET    /authors
- GET    /authors/:id
- POST   /authors
- PUT    /authors/:id
- DELETE /authors/:id

### Posts
- GET    /posts
- GET    /posts/:id
- GET    /posts/author/:authorId
- POST   /posts
- PUT    /posts/:id
- DELETE /posts/:id

## Documentación OpenAPI

El archivo `openapi.yaml` está en la raíz del proyecto.
Podés visualizarlo en https://editor.swagger.io pegando el contenido del archivo.

## Deploy en Railway

### URL pública
https://proyectom2gonzalobastias-production.up.railway.app

### Pasos para reproducir el deploy

1. Crear cuenta en [railway.app](https://railway.app)
2. Nuevo proyecto → **Deploy from GitHub repo**
3. Agregar servicio **PostgreSQL** desde el marketplace
4. Configurar variables de entorno en el servicio de la app usando referencias a Postgres:

   | Variable      | Valor                        |
   |---------------|------------------------------|
   | DB_HOST       | `${{Postgres.PGHOST}}`       |
   | DB_PORT       | `${{Postgres.PGPORT}}`       |
   | DB_NAME       | `${{Postgres.PGDATABASE}}`   |
   | DB_USER       | `${{Postgres.PGUSER}}`       |
   | DB_PASSWORD   | `${{Postgres.PGPASSWORD}}`   |
   | NODE_ENV      | `production`                 |

5. Hacer click en **Deploy**
6. Una vez deployado, correr las migraciones desde local usando la URL pública de Postgres:
```bash
   psql "postgresql://USER:PASSWORD@HOST:PORT/railway" -f src/db/schema.sql
   psql "postgresql://USER:PASSWORD@HOST:PORT/railway" -f src/db/seed.sql
```
   *(Las credenciales se obtienen de la variable `DATABASE_PUBLIC_URL` en el servicio Postgres de Railway)*

7. Railway redespliega automáticamente con cada push a `main`

## Uso de IA

Se utilizó IA como asistente para: estructura del proyecto, consultas SQL,
implementación de endpoints con Express 5, configuración de tests con Jest/Supertest,
documentación OpenAPI y configuración del deploy en Railway.