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
      
      content += `### Architectural Performance Profile\n\n`;
      
      const detailedGraph = await this.graphReporter.generateGraph(
        `${scenario}_detailed_perf`,
        this.graphReporter.getDetailedPerformanceConfig(scenario, monolith, hybrid)
      );
      content += `![Performance Profile](./graphs/${path.basename(detailedGraph)})\n\n`;

      content += `| Metric | Monolith (Baseline) | Hybrid (Experimental) | Delta (%) |\n`;
      content += `|--------|---------------------|----------------------|-----------|\n`;
      content += `| Throughput (RPS) | ${monolith.throughput.toFixed(2)} | ${hybrid.throughput.toFixed(2)} | ${MetricCalculator.calculateDelta(monolith.throughput, hybrid.throughput).toFixed(2)}% |\n`;
      content += `| Latency p50 (ms) | ${monolith.latency_p50.toFixed(2)} | ${hybrid.latency_p50.toFixed(2)} | ${MetricCalculator.calculateDelta(monolith.latency_p50, hybrid.latency_p50).toFixed(2)}% |\n`;
      content += `| Latency p95 (ms) | ${monolith.latency_p95.toFixed(2)} | ${hybrid.latency_p95.toFixed(2)} | ${MetricCalculator.calculateDelta(monolith.latency_p95, hybrid.latency_p95).toFixed(2)}% |\n`;
      content += `| Latency p99 (ms) | ${monolith.latency_p99.toFixed(2)} | ${hybrid.latency_p99.toFixed(2)} | ${MetricCalculator.calculateDelta(monolith.latency_p99, hybrid.latency_p99).toFixed(2)}% |\n`;
      content += `| Success Rate | ${(monolith.success_rate * 100).toFixed(2)}% | ${(hybrid.success_rate * 100).toFixed(2)}% | ${MetricCalculator.calculateDelta(monolith.success_rate, hybrid.success_rate).toFixed(2)}% |\n\n`;

      if (this.options.includeScs) {
        content += `### SCS & Complexity Metrics\n\n`;
        content += `| Metric | Monolith | Hybrid | Multiplier |\n`;
        content += `|--------|----------|--------|------------|\n`;
        content += `| Files Touched | ${monolith.scs_files_touched} | ${hybrid.scs_files_touched} | ${(hybrid.scs_files_touched! / monolith.scs_files_touched!).toFixed(2)}x |\n`;
        content += `| LOC Churn | ${monolith.scs_loc_churn} | ${hybrid.scs_loc_churn} | ${(hybrid.scs_loc_churn! / monolith.scs_loc_churn!).toFixed(2)}x |\n`;
        content += `| Avg Files/Commit | ${monolith.scs_avg_files_per_commit?.toFixed(2)} | ${hybrid.scs_avg_files_per_commit?.toFixed(2)} | ${(hybrid.scs_avg_files_per_commit! / monolith.scs_avg_files_per_commit!).toFixed(2)}x |\n`;
        content += `| Max Files/Commit | ${monolith.scs_max_files_single_commit} | ${hybrid.scs_max_files_single_commit} | ${(hybrid.scs_max_files_single_commit! / monolith.scs_max_files_single_commit!).toFixed(2)}x |\n\n`;

        content += `#### Development Type Space Distribution\n\n`;
        content += `| Commit Type | Monolith | Hybrid |\n`;
        content += `|-------------|----------|--------|\n`;
        const allTypes = Array.from(new Set([
          ...Object.keys(monolith.scs_commit_type_dist || {}),
          ...Object.keys(hybrid.scs_commit_type_dist || {})
        ])).sort();
        
        for (const type of allTypes) {
          const monoCount = monolith.scs_commit_type_dist?.[type] || 0;
          const hybCount = hybrid.scs_commit_type_dist?.[type] || 0;
          content += `| ${type} | ${monoCount} | ${hybCount} |\n`;
        }
        content += `\n`;

        content += `#### Software Complexity Analysis\n\n`;
        const complexityDelta = ((hybrid.scs_avg_files_per_commit! / monolith.scs_avg_files_per_commit!) - 1) * 100;
        content += `- **Cognitive Load**: The Hybrid architecture shows a **${Math.abs(complexityDelta).toFixed(1)}% ${complexityDelta > 0 ? 'increase' : 'decrease'}** in average files touched per commit.\n`;
        content += `- **Structural Blast Radius**: Maximum files edited in a single commit is **${(hybrid.scs_max_files_single_commit! / monolith.scs_max_files_single_commit!).toFixed(1)}x** larger in Hybrid, indicating higher cross-component coupling during certain operations.\n`;
        content += `- **Development Velocity**: Monolith favors more frequent, smaller commits while Hybrid shows larger, more consolidated architectural changes.\n\n`;

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
