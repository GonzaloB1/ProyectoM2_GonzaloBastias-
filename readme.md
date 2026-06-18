# MiniBlog API

API REST para gestionar autores y posts, desarrollada con Node.js + Express 5 + PostgreSQL.

## Stack

- Node.js v18+
- Express 5
- PostgreSQL v15+ (driver `pg`)
- Jest + Supertest (testing)
- OpenAPI + Swagger UI (documentacion)

## Instalacion y ejecucion local

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

4. Crear las tablas y cargar los datos de prueba (el script incluye schema + seed):
```bash
   psql -U postgres -d miniblog -f src/db/setup.sql
```

5. Configurar variables de entorno:
```bash
   cp .env.example .env
   # Editar .env con tus credenciales
```

6. Iniciar el servidor:
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
DB_PASSWORD=tu_password
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

## Documentacion OpenAPI

El archivo `docs/openapi.yaml` contiene la especificacion completa.

Se puede visualizar de dos formas:

- **Swagger UI en vivo (recomendado):** https://proyectom2gonzalobastias-production.up.railway.app/api-docs
- **Local:** correr el servidor (`npm start`) y entrar a `http://localhost:3000/api-docs`
- **Alternativa sin levantar el servidor:** [ver en Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/GonzaloB1/ProyectoM2_GonzaloBastias-/main/docs/openapi.yaml) (carga el archivo automaticamente desde el repo)

## Deploy en Railway

### URL publica
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
6. Una vez deployado, correr el script contra la base de produccion usando la URL publica de Postgres (incluye schema + seed):
```bash
   psql "postgresql://USER:PASSWORD@HOST:PORT/railway" -f src/db/setup.sql
```
   *(Las credenciales se obtienen de la variable `DATABASE_PUBLIC_URL` en el servicio Postgres de Railway)*

7. Railway redespliega automaticamente con cada push a `main`

## Uso de IA

Se utilizo Claude (Anthropic) como asistente durante todo el desarrollo del proyecto. A continuacion el detalle de los prompts mas relevantes y su influencia:

| Prompt utilizado | Influencia en el desarrollo |
|---|---|
| "Vamos a hacerlo paso a paso, tengo que guardarlo en GitHub con commits" | Definio el flujo de trabajo: commits separados por etapa (SQL, arrays en memoria, conexion real a DB, middleware de errores, tests, docs OpenAPI, deploy) |
| "Diagnostico de IDs desincronizados en Postgres luego de truncar tablas" | Identifico que las secuencias SERIAL no se reinician con TRUNCATE simple; se resolvio con `TRUNCATE ... RESTART IDENTITY CASCADE` |
| "Revision de mensaje extrano de la libreria dotenv en consola" | Se confirmo que era un mensaje promocional inofensivo de dotenv v17 y no un riesgo de seguridad |
| "Guia paso a paso para deploy en Railway" | Asistencia en la creacion del servicio Postgres, conexion del repo de GitHub, configuracion de variables de entorno usando referencias entre servicios (`${{Postgres.PGHOST}}`, etc.), generacion de dominio publico y carga del schema/seed contra la base de produccion |
| "Generar suite de tests con Jest y Supertest" | Se crearon 19 tests cubriendo CRUD y casos de error (400/404) para authors y posts |
| "Como podemos hacer el de Swagger" | Integracion de Swagger UI en `/api-docs` usando `swagger-ui-express` y `yamljs`, sirviendo la documentacion en vivo desde la propia API en lugar de solo un archivo estatico |
| "Mejorar lo que esta en insuficiencia segun auditoria recibida" | Se detecto que `setup.sql` habia quedado sin `CREATE TABLE` tras una limpieza anterior de archivos duplicados; se unifico schema + seed en un unico `setup.sql` reejecutable, se corrigio el placeholder de URL en `docs/openapi.yaml` y se agrego `NODE_ENV` a `.env.example` |

Cada paso fue ejecutado, probado manualmente con Postman/Thunder Client o PowerShell, y validado antes de avanzar al siguiente commit.