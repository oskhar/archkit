import { MetricsAggregator } from '../src/metrics/aggregator';
import { Architecture } from '../src/metrics/types';

describe('MetricsAggregator', () => {
  let aggregator: MetricsAggregator;

  beforeEach(() => {
    aggregator = new MetricsAggregator();
  });

  it('should aggregate monolith and hybrid results for the same scenario', () => {
    const results = [
      {
        runId: '1',
        architecture: Architecture.MONOLITH,
        scenario: 'PRODUCT_CRUD',
        startTime: '2026-03-31T00:00:00Z',
        endTime: '2026-03-31T00:01:00Z',
        metrics: {
          throughput: 100,
          latency_p50: 50,
          latency_p95: 100,
          latency_p99: 150,
          success_rate: 1,
          failure_rate: 0
        },
        devMetrics: { lead_time_min: 0, commit_count: 0, lines_changed: 0, churn_ratio: 0 }
      },
      {
        runId: '2',
        architecture: Architecture.HYBRID,
        scenario: 'PRODUCT_CRUD',
        startTime: '2026-03-31T00:02:00Z',
        endTime: '2026-03-31T00:03:00Z',
        metrics: {
          throughput: 80,
          latency_p50: 100,
          latency_p95: 200,
          latency_p99: 300,
          success_rate: 0.9,
          failure_rate: 10
        },
        devMetrics: { lead_time_min: 0, commit_count: 0, lines_changed: 0, churn_ratio: 0 }
      }
    ];

    const aggregated = aggregator.aggregate(results as any);
    expect(aggregated.length).toBe(1);
    expect(aggregated[0].scenario).toBe('PRODUCT_CRUD');
    expect(aggregated[0].monolith.throughput).toBe(100);
    expect(aggregated[0].hybrid.throughput).toBe(80);
    expect(aggregated[0].hybrid.failure_rate).toBe(10);
  });
});
