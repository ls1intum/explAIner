# ExplAIner
Master Thesis Project

ExplAIner is an LLM-based learning assistant that conducts adaptive learning sessions tailored to each student's knowledge level and goals.
Using Bloom's and SOLO taxonomies, it delivers AVIVA-structured content through inform-practice cycles that adapt based on student performance, ensuring effective knowledge acquisition through practice-first learning.



## Quick Start

### Start Environments (DEV / PRD)

**Development (`local-dev`):** Hot-reload enabled, runs on ports 3000/3001/5432  
```bash
# Start dev / prd
docker-compose -f docker-compose.dev.yml --env-file .env.dev up
docker-compose -f docker-compose.prd.yml --env-file .env.prd up --build
```

**Production (`local-prd`):** Production build testing, runs on ports 4000/4001/5433
```bash
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





## Tech Stack

### Backend
- **NestJS** - TypeScript framework for scalable server-side applications
- **Prisma** - Type-safe ORM for PostgreSQL database access
- **LangChain** - Framework for building LLM-powered applications
- **PostgreSQL** - Relational database

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS + Radix UI** - Styling and accessible component primitives
- **Redux Toolkit + RTK Query** - State management and data fetching

### Infrastructure & Testing
- **Docker** - Containerization for dev and production environments
- **Render** - Deployment platform
- **Playwright** - End-to-end testing
- **Jest** - Unit and integration testing





## How ExplAIner Works

### Overview
ExplAIner guides students through personalized learning sessions that adapt to their knowledge level and learning objectives. 
Built on pedagogical and didactical frameworks (BLOOM, AVIVA, SOLO), the application uses a practice-first approach to maximize learning effectiveness.

### Pedagogical Foundation
- **Bloom's Taxonomy**: Structures learning goals from basic recall to higher-order thinking (Remember → Create)
- **SOLO Taxonomy**: Progressively builds understanding from isolated facts to integrated, transferable knowledge
- **Practice-First Approach**: Questions are generated before content, ensuring targeted and relevant instruction

### Session Flow

**1. Session Setup**
- Students enter a topic or question they want to learn
- Optional: students can indicate their prior knowledge using keywords
- ExplAIner generates 3 learning goals at different cognitive levels (based on Bloom's Taxonomy)
- Students select a goal or create a custom one

**2. Block Sequences**
Each learning cycle consists of:
- **1 x INFORM Block**: Structured inform content delivery (explanation, key facts, overview) and interactive chat for follow-up questions and clarifications
- **3 x PRACTICE Blocks**: Progressive multiple-choice questions designed using SOLO Taxonomy

**3. Adaptive Progression**
- If all 3 practice questions of the current block sequence are answered correctly → Session ends with summary
- If 1 or more mistakes occur → New block sequence, with next INFROM block addressing misconceptions
- After 2 failed block sequences → Option to adjust learning goal to better match current knowledge level

**4. Session Summary**
- Recap of learned concepts
- Performance metrics (blocks completed, duration)
- Connection to achieved learning goal
