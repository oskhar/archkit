# archkit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-25

## Active Technologies
- MySQL (isolated per service in Hybrid, shared in Monolith) (000-pos-architecture-benchmark)
- TypeScript / Node.js 20+ + NestJS, TypeORM, Zod, MySQL, Kafka, Docker, Docker Compose (scs-hybrid--production-docker)
- MySQL (Independent instances per microservice in hybrid; single instance in monolith) (scs-hybrid--production-docker)
- Bash / Git + Git, Speckit CLI, `sed` (or similar for replacement) (003-fix-scs-naming)
- N/A (Repository Metadata) (003-fix-scs-naming)

- TypeScript (Node.js 20+) + NestJS, TypeORM, Zod, MySQL, Kafka, @nestjs/cqrs, TurboRepo (000-pos-architecture-benchmark)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript (Node.js 20+): Follow standard conventions

## Recent Changes
- 003-fix-scs-naming: Added Bash / Git + Git, Speckit CLI, `sed` (or similar for replacement)
- scs-hybrid--production-docker: Added TypeScript / Node.js 20+ + NestJS, TypeORM, Zod, MySQL, Kafka, Docker, Docker Compose
- 000-pos-architecture-benchmark: Added TypeScript (Node.js 20+) + NestJS, TypeORM, Zod, MySQL, Kafka, @nestjs/cqrs, TurboRepo


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
