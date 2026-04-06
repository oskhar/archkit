# archkit Laboratory Guide: Benchmark Execution & Reporting

To execute the laboratory benchmarks and produce research-aligned reports, follow this sequential workflow. This process ensures isolation between the Monolith (Baseline) and Hybrid (Experimental) architectures to prevent resource contention during measurement.

## 1. Step-by-Step Execution Sequence

### Phase A: Infrastructure & Environment Setup
To ensure research-grade parity, both architectures MUST be executed within Docker containers with strictly controlled resource limits (Monolith = 1/3 Total Hybrid Domain resources).

1. **Start Infrastructure**: Ensure databases and Kafka are running:
   ```bash
   docker compose -f infrastructure/docker/docker-compose.yml up -d
   ```
2. **Build Applications**:
   ```bash
   docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.apps.yml build
   ```

### Phase B: Monolith (Baseline) Execution
1. **Start App**: 
   ```bash
   docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.apps.yml up -d monolith
   ```
2. **Seed Monolith**: `cd laboratory && npm run seed:monolith -- --items 1000` (Note: Ensure `.env` points to `localhost:3310` or use `docker exec`).
3. **Run Scenarios**: Execute Artillery in sequence.
   - `npm run test:us1 -- -o results/monolith-product_crud-$(date +%s).json`
   - `npm run test:us2 -- -o results/monolith-inventory_sync-$(date +%s).json`
   - `npm run test:us3 -- -o results/monolith-sales_transaction-$(date +%s).json`
4. **Stop App**: `docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.apps.yml stop monolith`

### Phase C: Hybrid (Experimental) Execution
1. **Start Services**:
   ```bash
   docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.apps.yml up -d product-service inventory-service sales-service api-gateway
   ```
2. **Seed Hybrid**: `npm run seed:hybrid -- --items 1000`
3. **Run Scenarios**:
   - `npm run test:us1 -- -o results/hybrid-product_crud-$(date +%s).json`
   - `npm run test:us2 -- -o results/hybrid-inventory_sync-$(date +%s).json`
   - `npm run test:us3 -- -o results/hybrid-sales_transaction-$(date +%s).json`
4. **Stop Environment**: `docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.apps.yml down`

---

## 2. Refined Report Generation & Interpretation

Run the **Refined Automated Reporter** to synthesize JSON results, extract Git metrics, and generate high-detail visualizations:

```bash
# Recommended for research-grade output
npm run lab:report -- --high-res --include-scs
```

### Automated Deliverables:
- **Comparative Report**: A timestamped Markdown file in `laboratory/reports/BENCHMARK_REPORT_[TS].md`.
- **Traceability Log**: `laboratory/reports/BENCHMARK_REPORT_TRACE.md` mapping graphs to raw JSON sources.
- **High-Res Visualizations**: Located in `laboratory/reports/graphs/`.

### How to Interpret the Visualizations:
*   **Performance Comparison (Dual-Axis)**: Visualizes the "Architectural Tax" by plotting Throughput (RPS) vs Latency p95 in a single view.
*   **Latency & Throughput Trends**: Detailed line charts capturing performance stability and concurrency effects over multiple runs.
*   **Complexity vs. Performance (Scatter Plot)**: Correlates Developer Effort (LOC Churn) with Runtime Performance (p95) to quantify the Resource Efficiency Ratio (RER).
*   **Consistency Lag & Rehydration**: Bar charts quantifying the temporal costs of the Hybrid architecture's eventual consistency model.

---

## 3. Metrics & Data Integrity

### Development Metrics (Git Automation)
The laboratory now automatically extracts SCS metrics using `execSync` queries. To ensure "Time between commits" and "Lead time" are accurate:
1. **Enable Hook**: Copy `laboratory/scripts/git-metrics-hook.sh` to `.git/hooks/post-commit`.
2. **Atomic Commits**: Every commit MUST represent a single logical task (Principle V).

### Data Validation
The reporter uses a `DataValidator` to prune incomplete datasets. If a chart appears "empty," verify that the raw Artillery JSON contains:
- `http.requests` > 0
- `success_rate` is a valid number
- `latency_p95` is recorded

---

## 4. Critical Parameters for Research Alignment

| Parameter | Research Objective | Adjustment Strategy |
| :--- | :--- | :--- |
| **Concurrency Level** | Test H1 (Scalability) | Increase `arrivalRate` in `.yml` scenarios to identify the Monolith's breaking point. |
| **Consistency Lag** | Test H4 (Consistency) | Artificially delay Kafka consumers to measure the impact on Eventual Consistency Lag (ms). |
| **Commit Intervals** | Test H3 (Complexity) | Use intervals (min) between atomic commits to measure cognitive load/context switching. |
| **Lead Time** | Test SCS Discipline | Measure the total duration (first commit to merge) to compare architectural agility. |

By iterating through these parameters, you generate the objective data required to conclude the architectural comparison between Modular Monoliths and Microservices.
