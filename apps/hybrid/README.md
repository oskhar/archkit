# Hybrid Architecture Monorepo

This directory contains the hybrid microservices architecture implementation for ArchKit.

## Structure

- `apps/`: Individual microservices (NestJS, Kafka consumers/producers).
- `packages/`: Shared configurations and internal libraries.

## Getting Started

1. Navigate to this directory: `cd apps/hybrid/`
2. Install dependencies: `npm install`
3. Run tasks via Turbo:
   - `npm run build`
   - `npm run lint`
   - `npm run test`

## Architecture Isolation

This monorepo is isolated from the `apps/monolith/` to ensure architectural parity experiments are clean and measurable.
