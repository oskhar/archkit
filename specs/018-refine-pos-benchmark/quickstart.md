# Quickstart: Benchmark Reproduction

## 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+
- npm

## 2. Infrastructure Setup
Run the shared infrastructure (Databases, Kafka):
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

## 3. Launch Architectures
### Monolith
```bash
docker-compose -f infrastructure/docker/docker-compose.monolith.yml up -d
```

### Hybrid
```bash
docker-compose -f infrastructure/docker/docker-compose.hybrid.yml up -d
```

## 4. Run Benchmark
Execute the benchmark scenarios using Artillery:
```bash
cd laboratory
npm install
npm run scenario:product-lifecycle
npm run scenario:inventory-sync
npm run scenario:sales-transaction
```

## 5. Generate Report
Generate the comparative report and graphs:
```bash
npm run report:generate
```
The final artifacts will be available in `laboratory/reports/`.
