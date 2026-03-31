import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration, Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend, ScatterController, PointElement, LineController, LineElement } from 'chart.js';
import { MetricSet } from '../metrics/types';
import * as fs from 'fs';
import * as path from 'path';

// Register components for Chart.js 4+
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend, ScatterController, PointElement, LineController, LineElement);

export class GraphReporter {
  private readonly chartJSNodeCanvas: ChartJSNodeCanvas;
  private readonly width = 2000;
  private readonly height = 1000;

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

  public getComparisonConfig(scenario: string, metricName: string, monolithValue: number, hybridValue: number): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: ['Monolith (Baseline)', 'Hybrid (Experimental)'],
        datasets: [{
          label: `${scenario} - ${metricName}`,
          data: [monolithValue, hybridValue],
          backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
          borderColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: { size: 24, weight: 'bold' }
            }
          },
          title: {
            display: true,
            text: `${scenario}: ${metricName} Comparison`,
            font: { size: 36, weight: 'bold' },
            padding: 20
          },
          subtitle: {
            display: true,
            text: 'High-Resolution Research-Grade Visualization',
            font: { size: 20, style: 'italic' },
            padding: { bottom: 20 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 20 }
            },
            title: {
              display: true,
              text: metricName,
              font: { size: 24, weight: 'bold' }
            }
          },
          x: {
            ticks: {
              font: { size: 20 }
            }
          }
        }
      }
    };
  }

  public getDualAxisConfig(scenario: string, throughput: [number, number], latency: [number, number]): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: ['Monolith (Baseline)', 'Hybrid (Experimental)'],
        datasets: [
          {
            label: 'Throughput (RPS)',
            data: throughput,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Latency p95 (ms)',
            data: latency,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Throughput vs Latency`,
            font: { size: 36, weight: 'bold' }
          },
          subtitle: {
            display: true,
            text: 'Visualizing Architecture Latency Tax',
            font: { size: 20, style: 'italic' }
          },
          legend: {
            labels: { font: { size: 24 } }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Throughput (RPS)',
              font: { size: 24 }
            },
            ticks: { font: { size: 20 } }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: {
              display: true,
              text: 'Latency p95 (ms)',
              font: { size: 24 }
            },
            ticks: { font: { size: 20 } }
          },
          x: {
            ticks: { font: { size: 20 } }
          }
        }
      }
    };
  }

  public getConsistencyLagConfig(scenario: string, lagMs: number): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: ['Eventual Consistency Lag'],
        datasets: [{
          label: `${scenario} - Lag (ms)`,
          data: [lagMs],
          backgroundColor: ['rgba(255, 206, 86, 0.8)'],
          borderColor: ['rgb(255, 206, 86)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        animation: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  public getComplexityVsPerformanceConfig(scenario: string, monolith: MetricSet, hybrid: MetricSet): ChartConfiguration {
    return {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Monolith (Baseline)',
            data: [{ x: monolith.scs_loc_churn || 0, y: monolith.latency_p95 }],
            backgroundColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 15
          },
          {
            label: 'Hybrid (Experimental)',
            data: [{ x: hybrid.scs_loc_churn || 0, y: hybrid.latency_p95 }],
            backgroundColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 15
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Complexity (LOC) vs Latency (p95)`,
            font: { size: 36 }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Lines of Code (LOC) Churn', font: { size: 24 } },
            ticks: { font: { size: 20 } }
          },
          y: {
            title: { display: true, text: 'Latency p95 (ms)', font: { size: 24 } },
            ticks: { font: { size: 20 } }
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
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 4
          },
          {
            label: 'Hybrid',
            data: hybridData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 4
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: ${metricName} Trend`,
            font: { size: 36 }
          },
          legend: { labels: { font: { size: 24 } } }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: metricName, font: { size: 24 } },
            ticks: { font: { size: 20 } }
          },
          x: {
            title: { display: true, text: 'Time/Run', font: { size: 24 } },
            ticks: { font: { size: 20 } }
          }
        }
      }
    };
  }
}
