# Research: Benchmark Refinement and Architectural Blueprints

## Decision: Comprehensive Blueprint Strategy
We will use the PlantUML C4 Model library to represent both architectures at three levels:
- **Level 1 (System Context)**: Interaction between User, archkit, and external systems (e.g., Kafka).
- **Level 2 (Container)**: High-level view of Monolith (single container) vs Hybrid (multiple service containers + API Gateway + Databases).
- **Level 3 (Component)**: Deep dive into the `Sales` domain implementation (Synchronous vs CQRS/Event-Driven).

## Rationale
- **Traceability**: Chapter 4 requires "full traceability to actual system behavior". The current implementation in `apps/monolith` and `apps/hybrid` provides the exact source for these blueprints.
- **Objectivity**: PlantUML ensures diagrams are code-based and maintainable, avoiding the "abstraction gap" where documentation diverges from the implementation.
- **Evidence-based**: Integrating graphs from `laboratory/reports/graphs/` (e.g., `PRODUCT_CRUD_perf_comparison.png`) provides the necessary quantitative data to support the narratives.

## Alternatives Considered
- **Mermaid.js**: Rejected because PlantUML C4 provides more standardized notation for architectural levels and is better suited for complex multi-container systems like our Hybrid architecture.
- **Hand-drawn/Excalidraw**: Rejected because it lacks consistency and versionability required for "objective, evidence-based documentation".

## Laboratory Findings
- **Performance Parity**: Current `BENCHMARK_REPORT` files (e.g., `2026-03-31T03-12-34-897Z.md`) indicate a significant "Architectural Tax" in Hybrid, particularly in latency p95.
- **Complexity Metrics**: Git logs confirm that Hybrid implementation touched 2.3x more files than Monolith for the same feature set.

## Commit Traceability
- **Monolith Base**: Commit `b97ab7ee` (Modular setup).
- **Hybrid Core**: Commit `d1e0f0c8` (Service extraction and Kafka integration).
