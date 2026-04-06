import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  LogarithmicScale, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineController, 
  LineElement, 
  Filler,
  ScatterController,
  ChartConfiguration
} from 'chart.js';
import { MetricSet } from '../metrics/types';
import * as fs from 'fs';
import * as path from 'path';

// Register components for Chart.js 4+
Chart.register(
  CategoryScale, 
  LinearScale, 
  LogarithmicScale, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineController, 
  LineElement, 
  Filler,
  ScatterController
);

export class GraphReporter {
  private readonly chartJSNodeCanvas: ChartJSNodeCanvas;
  private readonly width = 3000; 
  private readonly height = 1200;

  constructor(private readonly outputDir: string) {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({ 
      width: this.width, 
      height: this.height, 
      backgroundColour: 'white'
    });
  }

  public async generateGraph(name: string, configuration: ChartConfiguration): Promise<string> {
    const buffer = await this.chartJSNodeCanvas.renderToBuffer(configuration as any);
    const filePath = path.join(this.outputDir, `${name}.png`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  /**
   * Generates a detailed line chart comparing multiple metrics between Monolith and Hybrid.
   */
  public getDetailedPerformanceConfig(scenario: string, monolith: MetricSet, hybrid: MetricSet): ChartConfiguration {
    const metrics = [
      'Throughput (RPS)', 
      'Latency p50 (ms)', 
      'Latency p95 (ms)', 
      'Latency p99 (ms)', 
      'Success Rate (%)'
    ];

    const monolithData = [
      monolith.throughput,
      monolith.latency_p50,
      monolith.latency_p95,
      monolith.latency_p99,
      monolith.success_rate * 100
    ];

    const hybridData = [
      hybrid.throughput,
      hybrid.latency_p50,
      hybrid.latency_p95,
      hybrid.latency_p99,
      hybrid.success_rate * 100
    ];

    return {
      type: 'line',
      data: {
        labels: metrics,
        datasets: [
          {
            label: 'Monolith (Baseline)',
            data: monolithData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 6,
            pointRadius: 10,
            pointBackgroundColor: 'rgb(54, 162, 235)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Hybrid (Experimental)',
            data: hybridData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 6,
            pointRadius: 10,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        },
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Comprehensive Architectural Performance Profile`,
            font: { size: 48, weight: 'bold' },
            padding: 30
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 28, weight: 'bold' },
              padding: 30
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Metric Value',
              font: { size: 32, weight: 'bold' }
            },
            ticks: {
              font: { size: 24 }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)',
              lineWidth: 2
            }
          },
          x: {
            ticks: {
              font: { size: 28, weight: 'bold' },
              padding: 20
            },
            grid: {
              display: false
            }
          }
        }
      }
    };
  }

  public getTrendConfig(scenario: string, labels: string[], monolithData: number[], hybridData: number[], metricName: string): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Monolith',
            data: monolithData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 6,
            pointRadius: 8
          },
          {
            label: 'Hybrid',
            data: hybridData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 6,
            pointRadius: 8
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: ${metricName} Evolution Across Benchmark Runs`,
            font: { size: 42, weight: 'bold' },
            padding: 30
          },
          legend: {
            labels: { font: { size: 28, weight: 'bold' } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: metricName, font: { size: 32, weight: 'bold' } },
            ticks: { font: { size: 24 } },
            grid: { lineWidth: 2 }
          },
          x: {
            title: { display: true, text: 'Run ID (Timestamp Hash)', font: { size: 32, weight: 'bold' } },
            ticks: { font: { size: 24 } },
            grid: { display: false }
          }
        }
      }
    };
  }

  public getComparisonConfig(scenario: string, metricName: string, monolithValue: number, hybridValue: number): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: ['Monolith', 'Hybrid'],
        datasets: [{
          label: metricName,
          data: [monolithValue, hybridValue],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: ${metricName} Comparison`,
            font: { size: 36, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { font: { size: 24 } }
          },
          x: {
            ticks: { font: { size: 28, weight: 'bold' } }
          }
        }
      }
    };
  }

  /**
   * Generates a line chart connecting Monolith and Hybrid to show the "Complexity-Performance Gap".
   */
  public getComplexityVsPerformanceConfig(scenario: string, monolith: MetricSet, hybrid: MetricSet): ChartConfiguration {
    return {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Architectural Complexity-Performance Trade-off',
            data: [
              { x: monolith.scs_loc_churn || 0, y: monolith.latency_p95 },
              { x: hybrid.scs_loc_churn || 0, y: hybrid.latency_p95 }
            ],
            borderColor: 'rgba(75, 192, 192, 0.8)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 8,
            pointRadius: 25,
            pointHoverRadius: 30,
            pointBackgroundColor: [
              'rgb(54, 162, 235)', // Monolith Color
              'rgb(255, 99, 132)'  // Hybrid Color
            ],
            showLine: true,
            fill: false,
            tension: 0
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: 100
        },
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Complexity (LOC Churn) vs Performance (Latency p95)`,
            font: { size: 48, weight: 'bold' },
            padding: 40
          },
          legend: {
            display: true,
            labels: {
              font: { size: 32, weight: 'bold' },
              // Custom legend to explain colors
              generateLabels: (chart) => {
                return [
                  { text: 'Monolith (Blue Dot)', fillStyle: 'rgb(54, 162, 235)' },
                  { text: 'Hybrid (Red Dot)', fillStyle: 'rgb(255, 99, 132)' },
                  { text: 'Evolution Path', fillStyle: 'rgba(75, 192, 192, 0.8)', strokeStyle: 'rgba(75, 192, 192, 0.8)', lineWidth: 4 }
                ] as any;
              }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context: any) => `LOC: ${context.parsed.x}, Latency: ${context.parsed.y}ms`
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: { 
              display: true, 
              text: 'Lines of Code (LOC) Churn (Complexity)', 
              font: { size: 36, weight: 'bold' },
              padding: 20
            },
            ticks: { font: { size: 28 } },
            grid: { lineWidth: 2 }
          },
          y: {
            type: 'linear',
            title: { 
              display: true, 
              text: 'Latency p95 (ms) (Performance)', 
              font: { size: 36, weight: 'bold' },
              padding: 20
            },
            ticks: { font: { size: 28 } },
            grid: { lineWidth: 2 }
          }
        }
      }
    };
  }

  public getConsistencyLagConfig(scenario: string, lagMs: number): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: ['Current Lag'],
        datasets: [{
          label: `${scenario} - Consistency Lag (ms)`,
          data: [lagMs],
          borderColor: 'rgb(255, 206, 86)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 6,
          pointRadius: 15,
          showLine: false
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Eventual Consistency Propagation Lag`,
            font: { size: 36, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Lag (ms)', font: { size: 28 } }
          }
        }
      }
    };
  }

  public getDualAxisConfig(scenario: string, throughput: [number, number], latency: [number, number]): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: ['Monolith (Baseline)', 'Hybrid (Experimental)'],
        datasets: [
          {
            label: 'Throughput (RPS)',
            data: throughput,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 6,
            pointRadius: 12,
            yAxisID: 'y',
            tension: 0
          },
          {
            label: 'Latency p95 (ms)',
            data: latency,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 6,
            pointRadius: 12,
            yAxisID: 'y1',
            tension: 0
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Throughput & Latency Dual-Axis Analysis`,
            font: { size: 42, weight: 'bold' }
          },
          legend: {
            labels: { font: { size: 28 } }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Throughput (RPS)', font: { size: 32 } },
            ticks: { font: { size: 24 } }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Latency p95 (ms)', font: { size: 32 } },
            ticks: { font: { size: 24 } }
          },
          x: {
            ticks: { font: { size: 28, weight: 'bold' } }
          }
        }
      }
    };
  }
}
