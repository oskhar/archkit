<!--
SYNC IMPACT REPORT
- Version change: 1.1.0 → 1.2.0
- List of modified principles:
  - All principles refined for improved declarative strength and technical precision.
  - Principle III: Clarified hybrid architecture tech stack (TurboRepo, NestJS, Kafka).
  - Principle V: Added "Lead time per SCS" and "Time between commits" to mandatory metrics.
  - Principle VI-XII: Strengthened language regarding AS-IS/TO-BE separation and laboratory isolation.
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/spec-template.md (Updated to include Research Linkage placeholder)
  - ✅ .specify/templates/plan-template.md (Updated Constitution Check guidance)
- Follow-up TODOs: None
-->
# archkit Constitution

## Core Principles

### I. Experiment Integrity (NON-NEGOTIABLE)
This repository exists to evaluate development complexity across architectures. Every action MUST preserve the scientific validity of the comparison.

Rules:
* The same business capability MUST be implemented in both architectures using equivalent logic.
* No feature advantage allowed in one architecture that does not exist in the other.
* Any deviation MUST be explicitly documented in the experiment notes.
* Changes MUST preserve comparability between implementations.

Rationale:
Ensure results measure architectural impact, not developer bias or implementation variance.

### II. Strict Smallest Change Set (SCS) Discipline
Every branch represents exactly one Smallest Change Set to minimize variables during complexity measurement.

Rules:
* One branch = one SCS.
* No mixed concerns in a single branch.
* Each commit MUST be atomic and purposeful.
* No opportunistic refactoring.
* Branch names MUST follow predefined experiment naming: `scs-[architecture]--[feature-name]`.

Purpose:
Enable accurate, granular measurement of development complexity and traceability.

### III. Architecture Parity
Both architectures MUST implement the same domain capabilities using their respective idiomatic patterns.

**Monolith Architecture**:
* NestJS modular monolith
* TypeORM (MySQL 8.0)
* Zod DTO validation

**Hybrid Architecture**:
* Microservices per domain (TurboRepo + NestJS)
* CQRS + Event Sourcing patterns
* Kafka (Redpanda) as the event transport
* TypeORM (Independent MySQL instances per service)

Constraint:
Hybrid architecture MUST NOT introduce artificial complexity. It MUST represent a production-grade microservices implementation.

### IV. Vertical Slice Domain Ownership
The system MUST be decomposed by subdomain to preserve realistic boundaries.

Domains:
* **Product**: Item management and catalog.
* **Inventory**: Stock level management and reservations.
* **Sales**: Transaction processing and order fulfillment.

Rules:
* Each domain owns its logic, data, and boundaries.
* Cross-domain interaction MUST be explicit and contract-based.
* Domain leakage (direct DB access to another domain) is PROHIBITED.

### V. Measurable Development Complexity
All development MUST produce measurable signals for objective analysis.

Mandatory Metrics:
* Number of files touched per SCS.
* Lines of code (LOC) changed (added/removed/modified).
* Lead time per SCS (start to merge).
* Number of commits per SCS.
* Time interval between commits.

Rules:
* No squashing commits during the experiment.
* Commit timestamps MUST reflect actual work intervals.
* Measurement MUST be automated via instrumentation where possible.

### VI. Spec Integrity & Dual-Spec System (MANDATORY)
The system MUST maintain two distinct specification layers to prevent behavioral drift.

#### AS-IS Specification (Source of Truth)
Represents the ACTUAL behavior of the system as implemented.
* MUST reflect real system behavior, including bugs or inconsistencies.
* MUST NOT be normalized or idealized.
* MUST be validated through characterization tests.

#### TO-BE Specification (Research-Aligned Target)
Represents the INTENDED behavior derived from architectural research.
* MUST be explicitly derived from `docs/research.md`.
* MUST define improvements, constraints, and expected guarantees.
* MUST include justification from research citations.

Constraint:
AS-IS and TO-BE specs MUST NEVER be merged or blurred. Violation invalidates experiment integrity.

### VII. Verification Before Modification (CRITICAL)
No implementation change is permitted without prior behavioral verification.

Rules:
* Existing behavior MUST be captured in AS-IS spec before modification.
* Characterization tests MUST be created before any refactor or improvement.
* Changes MUST be validated against BOTH AS-IS tests (regression) and TO-BE tests (success).

Prohibited:
* Direct refactoring without behavioral capture.
* Silent behavior changes.

### VIII. Research Alignment Discipline
Research serves as a guiding reference, not an absolute truth to be followed blindly.

Rules:
* Research-driven changes MUST reference specific sections of `docs/research.md`.
* Contradictions between implementation and research MUST be documented, not hidden.
* Alignment labels MUST be used: `[ALIGNED]`, `[DIVERGENT]`, `[UNVERIFIED]`.

### IX. Controlled Improvement Protocol
All improvements MUST be explicit, measurable, and reversible.

Rules:
* Improvements MUST originate from a TO-BE specification.
* Each improvement MUST define its expected behavioral impact.
* Improvements MUST be implemented as new, isolated SCS branches.

### X. Laboratory Isolation Layer
A dedicated "laboratory" environment MUST be used for experimental validation.

Rules:
* Laboratory code MUST NOT alter production implementation directly.
* Laboratory MUST simulate scenarios defined in research using AS-IS/TO-BE inputs.
* Results MUST be reproducible and isolated from the core system state.

### XI. Spec Traceability Requirement
All specifications MUST be traceable to either implementation or research.

Rules:
* Each spec item MUST link to a code reference or a `docs/research.md` section.
* Orphan specifications are invalid and MUST be flagged.

### XII. Experiment Integrity Extension (Symmetry)
Ensures fairness across the multi-architecture comparison.

Rules:
* Improvements MUST be applied symmetrically across architectures.
* Any asymmetry MUST be explicitly justified with an impact analysis.
* Verification results MUST be comparable using identical test suites where possible.

## Architectural Constraints

**Repository Model**: Single repository (Monorepo) containing isolated architectures.

**Structure**:
```text
apps/
├── monolith/   # NestJS Modular Monolith
└── hybrid/     # TurboRepo Microservices
    ├── apps/   # Services (Product, Inventory, Sales)
    └── packages/ # Shared Contracts/Internal Libs
```

Rules:
* Shared code between Monolith and Hybrid MUST be strictly limited to contracts or constants.
* Hybrid services MUST communicate via event-driven contracts (Kafka).

## Development Workflow

**Branching Model (MANDATORY)**:
* Baseline: `scs-baseline--[domain]`
* Hybrid: `scs-hybrid--[service]`

Workflow:
1. Initialize SCS branch from `main`.
2. Capture AS-IS behavior (if modifying existing code).
3. Draft/Update TO-BE Specification.
4. Implement using TDD (Tests FIRST).
5. Record metrics and merge.

## Governance

This constitution overrides personal preferences and ad-hoc development decisions.

All Pull Requests MUST validate:
1. SCS scope compliance (No scope creep).
2. Architecture parity (Equivalent logic).
3. Metric validity (Accurate recording).

**Amendments**:
Amendments require a Version update (SemVer), justification, and impact analysis on experiment validity.

**Version**: 1.2.0 | **Ratified**: 2026-03-30 | **Last Amended**: 2026-03-30
