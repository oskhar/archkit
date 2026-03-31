✦ To execute the laboratory benchmarks and produce research-aligned reports, follow this sequential workflow. This process ensures isolation between the Monolith (Baseline) and Hybrid (Experimental)
  architectures to prevent resource contention during measurement.

  1. Step-by-Step Execution Sequence


  Phase A: Infrastructure & Seeding
  Ensure both environments are clean before starting to maintain data parity.
   1. Initialize Monolith DB: docker-compose -f infrastructure/docker/docker-compose.monolith.yml up -d
   2. Seed Monolith: cd laboratory && npm run seed:monolith -- --items 1000
   3. Initialize Hybrid Infrastructure: docker-compose -f infrastructure/docker/docker-compose.hybrid.yml up -d (Includes MySQL instances + Redpanda/Kafka).
      *Wait at least 15-30 seconds for Kafka to stabilize before seeding.*
   4. Seed Hybrid: npm run seed:hybrid -- --items 1000


  Phase B: Monolith (Baseline) Execution
   1. Start App: cd apps/monolith && npm run start
   2. Run Scenarios: Execute Artillery in sequence. Ensure output follows: `[arch]-[scenario]-[timestamp].json`
       * `artillery run scenarios/us1-product-lifecycle.yml -o results/monolith-product_crud-$(date +%s).json`
       * `artillery run scenarios/us2-inventory-sync.yml -o results/monolith-inventory_sync-$(date +%s).json`
       * `artillery run scenarios/us3-sales-transaction.yml -o results/monolith-sales_transaction-$(date +%s).json`
   3. Stop App: Terminate the monolith process to free ports and resources.


  Phase C: Hybrid (Experimental) Execution
   1. Start Services: cd apps/hybrid && npm run start:all (Uses TurboRepo to boot all microservices in parallel).
      *Note: Use `npm run start:dev` instead of `start:all` if you need hot-reload and watching.*
   2. Run Scenarios: Execute identical scenarios against the Hybrid gateway.
       * `artillery run scenarios/us1-product-lifecycle.yml -o results/hybrid-product_crud-$(date +%s).json`
       * `artillery run scenarios/us2-inventory-sync.yml -o results/hybrid-inventory_sync-$(date +%s).json`
       * `artillery run scenarios/us3-sales-transaction.yml -o results/hybrid-sales_transaction-$(date +%s).json`

  2. Report Collection & Interpretation

  Run the Refined Automated Reporter to synthesize JSON results and generate visual graphs:
  `npm run lab:report`

  This command automatically:
  - Loads all JSON results from `laboratory/results/`.
  - Calculates performance deltas and architectural metrics.
  - Generates comparative graphs in `laboratory/reports/graphs/`.
  - Produces a timestamped Markdown report in `laboratory/reports/BENCHMARK_REPORT_[TS].md`.

  How to Interpret the Reports:
   * **Visual Graphs**: Compare Monolith and Hybrid directly across RPS and Latency p95. Located in `reports/graphs/`.
   * **Throughput Delta**: A negative delta (e.g., -15%) in Hybrid indicates architectural overhead.
   * **Latency p95**: If the delta exceeds 50%, the "Microservices Latency" hypothesis (H2) is confirmed.
   * **Consistency Lag & Rehydration**: Visualized for Hybrid only; quantifies the cost of eventual consistency.
   * **DEI (Developer Effort Index)**: Compare lines_of_code_churn and files_touched to quantify complexity.

  3. Critical Parameters for Research Alignment


  To produce comprehensive and unbiased results, adjust the following variables in your laboratory/scenarios/*.yml files:



  ┌─────────────────────────────────┬────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Parameter                       │ Research Objective     │ Adjustment Strategy                                                                                                       │
  ├─────────────────────────────────┼────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Concurrency Level (arrivalRate) │ Test H1 (Scalability)  │ Increase from 20 to 200 VU to find the "Breaking Point" where Monolith latency spikes vs Hybrid stability.                │
  │ Event Delay (Consumer Throttle) │ Test H4 (Consistency)  │ Artificially delay Kafka consumers (e.g., 500ms) to measure system resilience to out-of-order state updates.              │
  │ Failure Rate                    │ Test Resilience        │ Use artillery-plugin-expect to track 5xx errors. Introduce service restarts during a run to measure Hybrid recovery time. │
  │ Data Volume                     │ Test H2 (Tail Latency) │ Increase seeded items from 1k to 100k to evaluate how TypeORM and MySQL indexing impact p99 latency as tables grow.       │
  │ Commit Granularity              │ Test H3 (Complexity)   │ Enforce atomic commits (T009) to ensure the Time between commits metric accurately reflects logical task complexity.      │
  └─────────────────────────────────┴────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘



  By iterating through these parameters, you generate the Resource Efficiency Ratio (RER) required by Principle VIII, providing the objective data needed to conclude the architectural comparison.
