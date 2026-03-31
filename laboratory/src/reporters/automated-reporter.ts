import { LabResult, Architecture, AggregatedResult } from '../metrics/types';
import { MetricCalculator } from '../metrics/calculator';
import { MetricsAggregator } from '../metrics/aggregator';
import { GraphReporter } from './graph-reporter';
import * as fs from 'fs';
import * as path from 'path';

export class AutomatedReporter {
  private readonly aggregator = new MetricsAggregator();

  constructor(
    private readonly reportsDir: string,
    private readonly graphReporter: GraphReporter,
    private readonly options: { highRes?: boolean; includeScs?: boolean } = {}
  ) {}

  public async generateReport(results: LabResult[]): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(this.reportsDir, `BENCHMARK_REPORT_${timestamp}.md`);
    
    let content = `# POS Architecture Complexity Benchmark Report (Enhanced)\n\n`;
    content += `*Generated on: ${new Date().toLocaleString()}*\n\n`;

    const aggregated = this.aggregator.aggregate(results);

    for (const entry of aggregated) {
      const { scenario, monolith, hybrid } = entry;
      content += `## Scenario: ${scenario}\n\n`;
      
      content += `### Performance Metrics\n\n`;
      content += `| Metric | Monolith (Baseline) | Hybrid (Experimental) | Delta (%) |\n`;
      content += `|--------|---------------------|----------------------|-----------|\n`;
      content += `| Throughput (RPS) | ${monolith.throughput.toFixed(2)} | ${hybrid.throughput.toFixed(2)} | ${MetricCalculator.calculateDelta(monolith.throughput, hybrid.throughput).toFixed(2)}% |\n`;
      content += `| Latency p95 (ms) | ${monolith.latency_p95.toFixed(2)} | ${hybrid.latency_p95.toFixed(2)} | ${MetricCalculator.calculateDelta(monolith.latency_p95, hybrid.latency_p95).toFixed(2)}% |\n`;
      content += `| Failure Rate | ${monolith.failure_rate.toFixed(2)}% | ${hybrid.failure_rate.toFixed(2)}% | ${MetricCalculator.calculateDelta(monolith.failure_rate, hybrid.failure_rate).toFixed(2)}% |\n\n`;

      // Generate Dual Axis Graph
      const dualGraph = await this.graphReporter.generateGraph(
        `${scenario}_perf_comparison`,
        this.graphReporter.getDualAxisConfig(scenario, [monolith.throughput, hybrid.throughput], [monolith.latency_p95, hybrid.latency_p95])
      );
      content += `![Performance Comparison](./graphs/${path.basename(dualGraph)})\n\n`;

      if (this.options.includeScs) {
        content += `### SCS & Complexity Metrics\n\n`;
        content += `| Metric | Monolith | Hybrid | Multiplier |\n`;
        content += `|--------|----------|--------|------------|\n`;
        content += `| Files Touched | ${monolith.scs_files_touched} | ${hybrid.scs_files_touched} | ${(hybrid.scs_files_touched! / monolith.scs_files_touched!).toFixed(2)}x |\n`;
        content += `| LOC Churn | ${monolith.scs_loc_churn} | ${hybrid.scs_loc_churn} | ${(hybrid.scs_loc_churn! / monolith.scs_loc_churn!).toFixed(2)}x |\n\n`;

        const complexityGraph = await this.graphReporter.generateGraph(
          `${scenario}_complexity_vs_perf`,
          this.graphReporter.getComplexityVsPerformanceConfig(scenario, monolith, hybrid)
        );
        content += `![Complexity vs Performance](./graphs/${path.basename(complexityGraph)})\n\n`;
      }

      content += `### Architectural Trade-offs\n\n`;
      const throughputDelta = MetricCalculator.calculateDelta(monolith.throughput, hybrid.throughput);
      const latencyDelta = MetricCalculator.calculateDelta(monolith.latency_p95, hybrid.latency_p95);
      
      content += `- **Throughput Efficiency**: ${throughputDelta > 0 ? 'Improved' : 'Reduced'} by ${Math.abs(throughputDelta).toFixed(2)}%\n`;
      content += `- **Latency Overhead**: ${latencyDelta > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(latencyDelta).toFixed(2)}%\n\n`;

      if (hybrid.consistency_lag_ms || hybrid.rehydration_time_ms) {
        content += `### Architectural Consequences (Hybrid Only)\n\n`;
        content += `| Metric | Value (ms) |\n`;
        content += `|--------|------------|\n`;
        if (hybrid.consistency_lag_ms) content += `| Eventual Consistency Lag | ${hybrid.consistency_lag_ms.toFixed(2)} |\n`;
        if (hybrid.rehydration_time_ms) content += `| State Rehydration Time | ${hybrid.rehydration_time_ms.toFixed(2)} |\n`;
        content += `\n`;

        if (hybrid.consistency_lag_ms) {
          const lagGraph = await this.graphReporter.generateGraph(
            `${scenario}_consistency_lag`,
            this.graphReporter.getConsistencyLagConfig(scenario, hybrid.consistency_lag_ms)
          );
          content += `![Consistency Lag](./graphs/${path.basename(lagGraph)})\n\n`;
        }
      }

      if (entry.trends) {
        const latencyTrend = await this.graphReporter.generateGraph(
          `${scenario}_latency_trend`,
          this.graphReporter.getTrendConfig(
            scenario, 
            entry.trends.labels, 
            entry.trends.monolithLatency, 
            entry.trends.hybridLatency, 
            'Latency p95 (ms)'
          )
        );
        content += `![Latency Trend](./graphs/${path.basename(latencyTrend)})\n\n`;

        const throughputTrend = await this.graphReporter.generateGraph(
          `${scenario}_throughput_trend`,
          this.graphReporter.getTrendConfig(
            scenario, 
            entry.trends.labels, 
            entry.trends.monolithThroughput, 
            entry.trends.hybridThroughput, 
            'Throughput (RPS)'
          )
        );
        content += `![Throughput Trend](./graphs/${path.basename(throughputTrend)})\n\n`;
      }
    }

    fs.writeFileSync(reportPath, content);
    return reportPath;
  }
}
