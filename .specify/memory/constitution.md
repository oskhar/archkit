# archkit Constitution

## Core Principles

### I. Experiment Integrity (NON-NEGOTIABLE)

This repository exists to evaluate development complexity across architectures.

Rules:

* The same business capability must be implemented in both architectures.
* No feature advantage allowed in one architecture that does not exist in the other.
* Any deviation must be explicitly documented in the experiment notes.
* Changes must preserve comparability between implementations.

Objective:
Ensure results measure architectural impact, not developer bias.

### II. Strict Smallest Change Set (SCS) Discipline

Every branch represents exactly one Smallest Change Set.

Rules:

* One branch = one SCS.
* No mixed concerns in a single branch.
* Each commit must be atomic and purposeful.
* No opportunistic refactoring.
* Branch names must follow predefined experiment naming.

Measurement requirements:

* Files changed must be measurable.
* Code changes must remain scoped.
* Commit history must reflect actual development flow.

Purpose:
Enable accurate measurement of development complexity.


### III. Architecture Parity

Both architectures must implement the same domain capabilities.

Monolith architecture:

* NestJS modular monolith
* TypeORM
* Zod DTO validation
* MySQL

Hybrid architecture:

* Microservices per domain
* CQRS
* Event sourcing
* Kafka as transport
* NestJS + @nestjs/cqrs
* TypeORM
* Zod DTO validation
* MySQL

Constraint:
Hybrid architecture must not introduce unnecessary network chatter or artificial complexity.

Goal:
Compare complexity fairly, not exaggerate architectural benefits.


### IV. Vertical Slice Domain Ownership

The system must be decomposed by subdomain.

Domains:

* Product (item management)
* Inventory (stock management)
* Sales (transaction processing)

Rules:

* Each domain owns its logic and boundaries.
* Cross-domain interaction must be explicit.
* Domain leakage is prohibited.

Hybrid architecture constraint:
Services must communicate via event-driven contracts.

Purpose:
Preserve realistic architectural structure.


### V. Measurable Development Complexity

All development must produce measurable signals.

Metrics required:

* Number of files touched per SCS
* Lines of code changed
* Lead time per SCS
* Number of commits per SCS
* Time between commits

Measurement must be automated where possible.

Rules:

* No squashing commits during experiment.
* Commit timestamps must reflect actual work.
* Metrics must be reproducible.

Goal:
Provide objective comparison between architectures.


## Architectural Constraints

Repository model:
Single repository experiment.

Structure must separate implementations clearly.

Example structure:

monolith/
- src/

hybrid/
- turbo.json
- apps/
-- api-gateway/
-- product/
-- inventory/
-- sales/


Rules:

* Shared code must remain minimal.
* Domains must remain isolated.
* Hybrid architecture must avoid tight coupling.

Performance constraint:
Event communication must not become a bottleneck due to poor design.


## Development Workflow

Branching model (MANDATORY):

Baseline Architecture

* scs-baseline--setup-nestjs
* scs-baseline--setup-database
* scs-baseline--product-domain
* scs-baseline--inventory-domain
* scs-baseline--sales-domain

Hybrid Architecture

* scs-hybrid--setup-turbo
* scs-hybrid--setup-nestjs
* scs-hybrid--setup-kafka
* scs-hybrid--setup-database
* scs-hybrid--product-service
* scs-hybrid--inventory-service
* scs-hybrid--sales-service

Workflow rules:

1. Create branch from main.
2. Implement only the assigned SCS.
3. Commit incrementally.
4. Record metrics.
5. Merge after completion.

Prohibited:

* Mixing SCS.
* Skipping experiment steps.
* Refactoring outside scope.


## Governance

This constitution overrides personal preferences and ad-hoc development decisions.

All pull requests must validate:

* SCS scope compliance
* Architecture parity
* Metric validity

Amendments to this constitution require:

1. Justification
2. Impact analysis on experiment validity
3. Version update

Experiment validity has higher priority than speed.


Version: 1.0.0 | Ratified: 2026-03-25 | Last Amended: 2026-03-25
