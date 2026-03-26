# archkit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-26

## Active Technologies
- MySQL (isolated per service in Hybrid, shared in Monolith) (000-pos-architecture-benchmark)
- TypeScript / Node.js 20+ + NestJS, TypeORM, Zod, MySQL, Kafka, Docker, Docker Compose (scs-hybrid--production-docker)
- MySQL (Independent instances per microservice in hybrid; single instance in monolith) (scs-hybrid--production-docker)
- Bash / Git + Git, Speckit CLI, `sed` (or similar for replacement) (003-fix-scs-naming)
- N/A (Repository Metadata) (003-fix-scs-naming)
- JSON (Config) / Node.js (Tooling context) + commitizen, cz-git (004-czrc-commit-emojis)
- TypeScript 5.7 (Node.js 20+) + NestJS 11, TypeORM 0.3.28, Zod 4.3, @nestjs/typeorm (005-scs-baseline--product-domain)
- MySQL 8.0 (005-scs-baseline--product-domain)
- TypeScript 5.7 (Node.js 20+) + NestJS 11, TypeORM 0.3.28, Jest, Supertest (008-scs-baseline--testing-validation)
- MySQL 8.0 (Docker) (008-scs-baseline--testing-validation)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, Jest 30.0.0, Supertest 7.0.0 (008-scs-baseline--testing-validation)
- MariaDB 11.8 (locally available) (008-scs-baseline--testing-validation)
- TypeScript 5.7 / Node.js 20+ + TurboRepo, NPM Workspaces (009-scs-hybrid-setup-turbo)
- N/A (Infrastructure setup) (009-scs-hybrid-setup-turbo)

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
- 010-scs-hybrid-relocate-turbo: Added TypeScript 5.7 / Node.js 20+ + TurboRepo, NPM Workspaces
- 009-scs-hybrid-setup-turbo: Added TypeScript 5.7 / Node.js 20+ + TurboRepo, NPM Workspaces
- 009-scs-hybrid-setup-turbo: Added TypeScript 5.7 / Node.js 20+ + TurboRepo, NPM Workspaces


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
