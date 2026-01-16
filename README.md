# ExplAIner
Master Thesis




## Docker Setup

### Environments

**Development (`local-dev`):** Hot-reload enabled, runs on ports 3000/3001/5432  
**Production (`local-prd`):** Production build testing, runs on ports 4000/4001/5433

### Quick Start

```bash
# Start dev / prd
docker-compose -f docker-compose.dev.yml --env-file .env.dev up
docker-compose -f docker-compose.prd.yml --env-file .env.prd up --build

# Stop dev / prd
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.prd.yml down
```

### Access

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| Development | http://localhost:3000 | http://localhost:3001 | localhost:5432 |
| Production | http://localhost:4000 | http://localhost:4001 | localhost:5433 |


### Setup Aliases (Recommended)

Run `nano ~/.zshrc` and add these 2 lines at the end:

```bash
alias dc-dev="docker compose -f docker-compose.dev.yml --env-file .env.dev"
alias dc-prd="docker compose -f docker-compose.prd.yml --env-file .env.prd"
```

Usage:
```bash
dc-dev up          # Start development
dc-prd up --build  # Start production
dc-dev down        # Stop development
dc-prd logs -f     # View logs
```

