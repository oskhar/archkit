export enum Architecture {
  MONOLITH = 'MONOLITH',
  HYBRID = 'HYBRID',
}

export interface MetricSet {
  // Performance
  throughput: number;
  latency_p50: number;
  latency_p95: number;
  latency_p99: number;
  success_rate: number;
  failure_rate: number;
  vusers_created?: number;
  vusers_failed?: number;
  session_length_p95?: number;
  
  // SCS Metrics
  scs_files_touched?: number;
  scs_loc_churn?: number;
  
  // Architectural Consequences
  consistency_lag_ms?: number;
  rehydration_time_ms?: number;
  storage_footprint_bytes?: number;
  
  // Resource usage (optional)
  cpu_usage_avg?: number;
  memory_mb_avg?: number;
}

export interface DeveloperMetrics {
  lead_time_min: number;
  commit_count: number;
  lines_changed: number;
  churn_ratio: number;
}

export interface LabResult {
  runId: string;
  architecture: Architecture;
  scenario: string;
  startTime: string;
  endTime: string;
  metrics: MetricSet;
  devMetrics: DeveloperMetrics;
}

export interface AggregatedResult {
  scenario: string;
  monolith: MetricSet;
  hybrid: MetricSet;
  metadata: Record<string, any>;
  trends?: {
    labels: string[];
    monolithLatency: number[];
    hybridLatency: number[];
    monolithThroughput: number[];
    hybridThroughput: number[];
    hybridLag: number[];
  };
}
