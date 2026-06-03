# ExplAIner

**Please refer to the official [ExplAIner WIKI ](https://github.com/martin-stierlen/ExplAIner/wiki) - Owlbert created it with love! ❤️🦉 You will find everything you need there!**

## Getting Started

The app runs fully containerized via Docker Compose: a Next.js client, a NestJS server, and a PostgreSQL database.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (verify with `docker version` and `docker compose version`)
- An LLM API key for the SAIA / OpenAI-compatible endpoint (e.g. from [SAIA – Academic Cloud](https://chat-ai.academiccloud.de/))

### Development

1. Create your environment file by copying the example and filling in the values (at minimum `LLM_API_KEY`):

   ```bash
   cp .env.dev.example .env.dev
   ```

2. Start the full stack (client, server, database) with hot-reload:

   ```bash
   docker compose -f docker-compose.dev.yml --env-file .env.dev up --build
   ```

3. Once the containers are up:

   | Service             | URL                                  |
   | ------------------- | ------------------------------------ |
   | Client (web app)    | http://localhost:3000                |
   | Server (API)        | http://localhost:3001/api            |
   | Health check        | http://localhost:3001/api/health     |
   | OpenAPI/Swagger docs| http://localhost:3001/api/docs       |

4. Stop the stack:

   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

> 💡 Tip: define an alias to save some typing —
> `alias dc-dev="docker compose -f docker-compose.dev.yml --env-file .env.dev"`,
> then use `dc-dev up --build` / `dc-dev down`.

### Production

The production stack uses its own compose file, env file, and ports (client `4000`, server `4001`):

```bash
cp .env.prd.example .env.prd                                          # then fill in ANTHROPIC_API_KEY etc.
docker compose -f docker-compose.prd.yml --env-file .env.prd up --build
```
