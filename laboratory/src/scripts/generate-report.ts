import { ResultsLoader } from '../metrics/loader';
import { GraphReporter } from '../reporters/graph-reporter';
import { AutomatedReporter } from '../reporters/automated-reporter';
import { TraceabilityLogger } from '../reporters/traceability-logger';
import { MetricsAggregator } from '../metrics/aggregator';
import * as path from 'path';

async function generate() {
  const args = process.argv.slice(2);
  const highRes = args.includes('--high-res');
  const includeScs = !args.includes('--no-scs');

  const resultsDir = path.join(__dirname, '../../results');
  const reportsDir = path.join(__dirname, '../../reports');
  const graphsDir = path.join(reportsDir, 'graphs');
  
  const loader = new ResultsLoader(resultsDir);
  const graphReporter = new GraphReporter(graphsDir);
  const reporter = new AutomatedReporter(reportsDir, graphReporter, { highRes, includeScs });
  const traceLogger = new TraceabilityLogger(reportsDir);
  const aggregator = new MetricsAggregator();

  console.log(`Generating refined comparative benchmark report (High-Res: ${highRes}, SCS/Complexity: ${includeScs})...`);
  if (includeScs) {
    console.log(`Analyzing GitHub development type space and structural complexity...`);
  }
  
  const results = loader.loadResults();
  if (results.length === 0) {
    console.error('No results found in', resultsDir);
    process.exit(1);
  }

  const reportPath = await reporter.generateReport(results);
  const aggregated = aggregator.aggregate(results);
  traceLogger.logTraceability(aggregated);

  console.log(`Report generated successfully at ${reportPath}`);
}

generate().catch(console.error);
