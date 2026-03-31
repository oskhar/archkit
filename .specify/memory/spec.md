# Feature Specification: POS Architecture Complexity Benchmark

**Feature Branch**: `000-pos-architecture-benchmark`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Compare development complexity between monolith and hybrid architecture using POS vertical slice implementation"


## Clarifications

### Session 2026-03-25
- Q: What happens when stock becomes negative? → A: Allow with warning/audit log
- Q: How to handle concurrent transactions? → A: Last write wins, warn loser
- Q: Commitment granularity for SCS? → A: Atomic (logical changes)
- Q: How to handle Kafka delays? → A: Eventual Consistency
- Q: How to recover from event failure? → A: Dead Letter Queue (DLQ)


## User Scenarios & Testing *(mandatory)*


### User Story 1 - Implement Product Domain (Priority: P1)

Developer implements product management (CRUD item) in both architectures.

This includes:

* create product
* update product
* list product

**Why this priority**:
Product domain adalah fondasi semua domain lain (inventory & sales depend on it). Tanpa ini, sistem tidak punya value.

**Independent Test**:
Can be fully tested by:

* creating product
* updating product
* retrieving product list

Value delivered:

* usable minimal POS core

**Acceptance Scenarios**:

1. **Given** no products exist, **When** developer creates a product, **Then** product is stored and retrievable
2. **Given** existing product, **When** developer updates product, **Then** changes are persisted
3. **Given** multiple products, **When** listing products, **Then** all products are returned


### User Story 2 - Implement Inventory Domain (Priority: P2)

Developer implements stock management linked to product.

Includes:

* stock initialization
* stock update (increase/decrease)
* stock query

**Why this priority**:
Inventory depends on product but not sales → logical second layer.

**Independent Test**:
Can be tested by:

* assigning stock to product
* modifying stock
* querying stock

Value:

* system becomes operational for stock tracking

**Acceptance Scenarios**:

1. **Given** product exists, **When** stock is assigned, **Then** stock is recorded
2. **Given** stock exists, **When** stock is reduced, **Then** quantity is updated correctly


### User Story 3 - Implement Sales Domain (Priority: P3)

Developer implements transaction system.

Includes:

* create transaction
* reduce stock
* record sales

**Why this priority**:
Sales is the highest complexity domain and depends on both product and inventory.

**Independent Test**:
Can be tested by:

* performing a transaction
* verifying stock reduction
* verifying transaction record

Value:

* complete POS flow

**Acceptance Scenarios**:

1. **Given** product with stock exists, **When** transaction occurs, **Then** stock decreases
2. **Given** transaction executed, **When** queried, **Then** transaction is recorded


### User Story 4 - Implement Hybrid Architecture Infrastructure (Priority: P1)

Developer sets up hybrid architecture environment.

Includes:

* microservices separation
* Kafka communication
* CQRS setup

**Why this priority**:
Without infrastructure, hybrid architecture cannot be evaluated.

**Independent Test**:
Can be tested by:

* sending event between services
* verifying message delivery

**Acceptance Scenarios**:

1. **Given** service emits event, **When** Kafka processes it, **Then** other service receives it
2. **Given** command is executed, **When** CQRS handler runs, **Then** state is updated


### User Story 5 - Measure Development Complexity (Priority: P1)

System records development metrics for each SCS.

**Why this priority**:
Core purpose of experiment is measurement, not just implementation.

**Independent Test**:
Can be tested by:

* creating a branch
* making commits
* verifying metrics output

**Acceptance Scenarios**:

1. **Given** a branch is created, **When** commits are made, **Then** metrics are recorded
2. **Given** SCS completed, **When** measurement script runs, **Then** metrics are generated


## Edge Cases

* **Negative Stock**: Allow transactions to proceed but generate a system warning and audit log.
* **Concurrent Transactions**: Last write wins; send a warning/audit log for the losing transaction.
* **Kafka Delay**: Rely on eventual consistency; services must handle late events without blocking.
* **Event Failure**: Recover via Dead Letter Queue (DLQ) for manual or automated reprocessing.
* What happens when one microservice is down?


## Requirements *(mandatory)*

### Functional Requirements

* **FR-001**: System MUST implement POS functionality in two architectures (monolith and hybrid)
* **FR-002**: System MUST maintain identical business logic across architectures
* **FR-003**: System MUST decompose system into Product, Inventory, and Sales domains
* **FR-004**: System MUST use NestJS, TypeORM, Zod, and MySQL in both architectures
* **FR-005**: Hybrid architecture MUST use Kafka for communication
* **FR-006**: Hybrid architecture MUST implement CQRS and event sourcing
* **FR-007**: System MUST track development metrics per SCS
* **FR-008**: Each branch MUST represent exactly one SCS
* **FR-009**: System MUST NOT allow cross-domain logic leakage
* **FR-010**: System MUST log all development activity relevant to metrics


### Key Entities *(include if feature involves data)*

* **Product**: item entity with attributes like id, name, price
* **Inventory**: stock entity linked to product with quantity
* **SalesTransaction**: transaction record with items and quantities
* **Event (Hybrid)**: domain event used for inter-service communication
* **SCSMetric**: measurement data per branch (files changed, LOC, commits, time)


## Success Criteria *(mandatory)*

### Measurable Outcomes

* **SC-001**: Each SCS produces measurable metrics (files changed, LOC, commits, time)
* **SC-002**: Monolith and hybrid implementations complete same domain features
* **SC-003**: Hybrid architecture successfully processes inter-service communication via Kafka
* **SC-004**: Lead time per SCS is recorded and comparable across architectures
* **SC-005**: No SCS contains mixed concerns (validated via review)
* **SC-006**: Metrics are reproducible from git history; requires atomic commits (one commit per logical change) per SCS.


## Assumptions

* Developer follows strict SCS discipline
* Same developer implements both architectures (introduces potential bias)
* Infrastructure (Kafka, DB) is stable during experiment
* No external load testing is required (focus is development complexity, not runtime performance)
* Monolith and hybrid share equivalent domain logic

## AS-IS Specification (Behavioral Truth Layer)

This section captures the actual system behavior as implemented.

### Scope

Covers:

* Product domain behavior
* Inventory domain behavior
* Sales domain behavior
* Hybrid event flow behavior
* Metric collection behavior


### AS-IS Behavioral Rules

#### Product Domain

* Product creation persists data without enforcing uniqueness beyond database constraints.
* Product update overwrites previous state (no versioning).

#### Inventory Domain

* Stock can become negative.
* No strict constraint prevents overselling.
* Stock updates are not guaranteed to be atomic across concurrent transactions.

#### Sales Domain

* Transaction reduces stock immediately (monolith) or eventually (hybrid).
* No rollback mechanism when downstream failure occurs.
* Transactions are recorded regardless of stock validity.

#### Hybrid Architecture Behavior

* Event delivery is eventually consistent.
* Message delay is tolerated.
* Out-of-order events may occur and must be tolerated.
* Failure handling relies on DLQ.

#### Concurrency Behavior

* Last write wins strategy is applied.
* Losing transactions are not retried automatically.
* Conflicts are logged but not resolved.


### Known Issues (MUST NOT BE FIXED HERE)

* Potential stock inconsistency under concurrent transactions.
* Event duplication or reprocessing risk.
* Temporary divergence between services in hybrid architecture.
* Lack of strong transactional guarantees across domains.


### Behavioral Uncertainty (Explicitly Unknown)

* Exact consistency guarantees under high concurrency.
* Failure propagation across services.
* Data reconciliation strategy after DLQ reprocessing.


## TO-BE Specification (Research-Aligned Target)

Derived strictly from `docs/research.md`.


### Intended Improvements

#### Consistency Model

* Define explicit consistency boundaries:

  * Strong consistency for monolith
  * Eventual consistency with guarantees for hybrid

#### Concurrency Handling

* Introduce conflict detection strategy:

  * versioning or optimistic locking
* Define retry or compensation behavior

#### Event Reliability

* Ensure:

  * idempotency
  * deduplication
  * retry policy
* DLQ must support deterministic recovery

#### Observability

* All events and state transitions must be traceable
* Metrics must include:

  * event latency
  * processing lag
  * failure rate

#### Metric Accuracy

* Ensure measurement is not biased by:

  * hidden refactors
  * inconsistent commit granularity


### Constraints

* Improvements MUST NOT break architecture parity
* Improvements MUST be applicable to both architectures
* Any asymmetry MUST be documented


## Gap Analysis (AS-IS vs TO-BE)

### Consistency

* AS-IS: implicit, weak guarantees
* TO-BE: explicit, measurable guarantees

Risk:
High — may change system behavior significantly


### Concurrency

* AS-IS: last write wins
* TO-BE: conflict-aware strategy

Risk:
Medium — may impact transaction flow


### Event Handling

* AS-IS: basic DLQ recovery
* TO-BE: deterministic and idempotent processing

Risk:
High — affects hybrid reliability


### Observability

* AS-IS: limited to logs
* TO-BE: structured tracing & metrics

Risk:
Low — additive


## Verification Strategy

### AS-IS (Characterization Tests)

Purpose:
Capture current behavior without modification.

Examples:

* Verify negative stock is allowed
* Verify last write wins behavior
* Verify event delay does not block system


### TO-BE (Validation Tests)

Purpose:
Validate research-aligned improvements.

Examples:

* Conflict detection prevents silent overwrite
* Event deduplication prevents double processing
* Metrics accurately reflect system activity


## Laboratory Preparation Specification

This spec will be used to construct a **laboratory environment**.

### Requirements

* Must simulate:

  * concurrent transactions
  * event delays
  * service failures
* Must compare:

  * monolith vs hybrid behavior
* Must produce:

  * reproducible results


### Inputs

* AS-IS spec
* TO-BE spec
* Research hypotheses (docs/research.md)


### Outputs

* behavioral comparison
* metric comparison
* deviation report


## Spec Traceability Matrix

Every element must map to:

| Spec Item      | Source                            |
| -------------- | --------------------------------- |
| AS-IS behavior | implementation                    |
| TO-BE behavior | docs/research.md                  |
| Metrics        | git history / measurement scripts |


## Risk Register

* Hidden divergence between architectures
* Measurement bias due to developer behavior
* Overfitting implementation to research expectations
* Misinterpretation of eventual consistency

Version: 1.1.0 | Updated: 2026-03-30

Changes:
- Introduced AS-IS specification layer (behavioral truth)
- Introduced TO-BE specification (research-aligned)
- Added explicit gap analysis
- Added verification strategy (characterization vs validation)
- Added laboratory preparation specification
- Added traceability requirements
- Added risk register
