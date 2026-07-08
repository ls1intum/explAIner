# ExplAIner

**Please refer to the official [ExplAIner WIKI ](https://github.com/martin-stierlen/ExplAIner/wiki) - Owlbert created it with love! ❤️🦉 You will find everything you need there!**

## Getting Started

The app runs fully containerized via Docker Compose: a Next.js client, a NestJS
server, and a PostgreSQL database. You do **not** need Node.js, npm, or Postgres
installed locally — only Docker.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed **and running**
  (verify with `docker version` and `docker compose version`).
- An LLM API key for the logos / OpenAI-compatible endpoint
  (the TUM AET chair's LLM service at `https://logos.aet.cit.tum.de`).

### 1. Configure environment variables

Copy the example file to `.env.dev` and edit it:

```bash
cp .env.dev.example .env.dev
```

- **`LLM_API_KEY` is required** — the server will refuse to start without it.
- `LLM_BASE_URL` and `LLM_MODEL` already have working defaults (logos).
- `DB_USER` / `DB_PASSWORD` / `DB_NAME` can be any values you like; they are used
  to create the local Postgres container on first run.

### 2. Start the stack (development)

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev up --build
```

> The `--env-file .env.dev` flag is required — Compose does **not** read `.env.dev`
> automatically (its default is `.env`).

On the **first** run this takes a few minutes (Docker pulls Postgres and installs
dependencies). The server container applies all database migrations automatically
(`prisma migrate deploy`) before starting — there is no manual database setup step.

### 3. Verify it's running

| Service              | URL                              |
| -------------------- | -------------------------------- |
| Client (web app)     | http://localhost:3000            |
| Server (API)         | http://localhost:3001/api        |
| Health check         | http://localhost:3001/api/health |
| OpenAPI/Swagger docs | http://localhost:3001/api/docs   |

The health page shows `Server Status: OK` and `Database Status: OK` once the stack
is ready.

### 4. Stop (and optionally reset)

```bash
docker compose -f docker-compose.dev.yml down       # stop & remove containers (keeps the database)
docker compose -f docker-compose.dev.yml down -v     # also delete the database volume (clean slate)
```

> 💡 Tip: define an alias to save some typing —
> `alias dc-dev="docker compose -f docker-compose.dev.yml --env-file .env.dev"`,
> then use `dc-dev up --build` / `dc-dev down`.

### Troubleshooting

- **`Cannot connect to the Docker daemon` / pipe errors** → Docker Desktop isn't
  running. Start it and wait until it reports "running", then retry.
- **`port is already allocated` (3000 / 3001 / 5432)** → another process is using
  the port. Stop it, or change `CLIENT_PORT` / `SERVER_PORT` in `.env.dev`.
- **Server container starts then exits immediately** → most often a missing or
  invalid `LLM_API_KEY` in `.env.dev`. Check logs with
  `docker compose -f docker-compose.dev.yml logs server`.
- **Changed the Prisma schema?** Generate a migration (`npx prisma migrate dev
  --name <change>` inside `server/`) and commit it — the dev container only
  *applies* existing migrations (`migrate deploy`), it does not create them.

### Production

The production stack uses its own compose file, env file, and ports (client `4000`,
server `4001`):

```bash
cp .env.prd.example .env.prd                                          # then fill in ANTHROPIC_API_KEY etc.
docker compose -f docker-compose.prd.yml --env-file .env.prd up --build
```
