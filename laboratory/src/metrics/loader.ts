import * as fs from 'fs';
import * as path from 'path';
import { ArtilleryOutputSchema } from './schema';
import { LabResult, Architecture } from './types';

export class GitMetricsLogger {
  private readonly logPath: string;

  constructor(resultsDir: string) {
    this.logPath = path.join(resultsDir, 'commit-intervals.jsonl');
  }

  public logCommit(data: { branch: string; commit: string; timestamp: number; interval_to_prev: number }): void {
    fs.appendFileSync(this.logPath, JSON.stringify(data) + '\n');
  }
}

export class ResultsLoader {
  constructor(private readonly resultsDir: string) {}

  public loadResults(): LabResult[] {
    if (!fs.existsSync(this.resultsDir)) return [];

    const files = fs.readdirSync(this.resultsDir).filter(f => f.endsWith('.json'));
    const results: LabResult[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(this.resultsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const validated = ArtilleryOutputSchema.parse(content);

        const parts = file.replace('.json', '').split('-');
        const architecture = parts[0].toUpperCase() === 'HYBRID' ? Architecture.HYBRID : Architecture.MONOLITH;
        const scenario = parts.slice(1, -1).join('-').toUpperCase();

        const summaries = validated.aggregate.summaries as Record<string, any>;
        const counters = validated.aggregate.counters as Record<string, number>;
        const rates = validated.aggregate.rates as Record<string, number>;
        const vusers = validated.aggregate.vusers;

        const httpResponseTime = (summaries['http.response_time'] || 
                                 summaries['vusers.session_length'] || 
                                 { p50: 0, p95: 0, p99: 0 });
        
        const sessionLength = summaries['vusers.session_length'] || { p50: 0, p95: 0, p99: 0 };
        const okCount = counters['http.codes.200'] || 0;
        const totalCount = counters['http.requests'] || 1;

        results.push({
          runId: parts[parts.length - 1],
          architecture,
          scenario,
          startTime: new Date(validated.aggregate.firstCounterAt || Date.now()).toISOString(),
          endTime: new Date(validated.aggregate.lastCounterAt || Date.now()).toISOString(),
          metrics: {
            throughput: rates['http.request_rate'] || 0,
            latency_p50: httpResponseTime.p50,
            latency_p95: httpResponseTime.p95,
            latency_p99: httpResponseTime.p99,
            success_rate: okCount / totalCount,
            failure_rate: ((totalCount - okCount) / totalCount) * 100,
            vusers_created: vusers?.created || 0,
            vusers_failed: vusers?.failed || 0,
            session_length_p95: sessionLength.p95,
            consistency_lag_ms: (counters['hybrid.consistency_lag_ms'] || 0),
            rehydration_time_ms: (counters['hybrid.rehydration_time_ms'] || 0)
          },
          devMetrics: {
            lead_time_min: 0,
            commit_count: 0,
            lines_changed: 0,
            churn_ratio: 0
          }
        });
      } catch (err) {
        console.error(`Failed to load/parse ${file}:`, err);
      }
    }

    return results;
  }
}
