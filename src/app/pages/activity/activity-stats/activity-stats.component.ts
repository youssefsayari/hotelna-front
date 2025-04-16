import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { TypeActivity } from 'src/app/models/typeActivity';
import { ActivityService } from 'src/app/services/activity.service';
import { Chart, registerables } from 'chart.js';
import { ActivityStats } from 'src/app/models/activity-stats';
Chart.register(...registerables);

@Component({
  selector: 'app-activity-stats',
  templateUrl: './activity-stats.component.html',
  styleUrls: ['./activity-stats.component.css']
})
export class ActivityStatsComponent implements OnInit {
  stats: ActivityStats | null = null;
  loading = true;
  error: string | null = null;
  charts: Chart[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = null;
    
    this.activityService.getActivityStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        setTimeout(() => this.createCharts(), 100); // Small delay to ensure DOM is ready
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.error = 'Failed to load statistics. Please try again later.';
        this.loading = false;
      }
    });
  }

  createCharts(): void {
    this.destroyCharts(); // Clean up existing charts
    
    if (!this.stats) return;

    // Chart 1: Activities by Type (Pie)
    this.createPieChart(
      'activitiesByTypeChart',
      'Activities by Type',
      this.stats.activitiesByType
    );

    // Chart 2: Participation by Type (Bar)
    this.createBarChart(
      'participationByTypeChart',
      'Participation by Type',
      this.stats.participationByType
    );

    // Chart 3: Recent Participation (Line)
    this.createLineChart(
      'recentParticipationChart',
      'Recent Participation (Last Week)',
      this.stats.recentParticipationCounts
    );
  }

  createPieChart(canvasId: string, title: string, data: Record<string, number>): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#8AC24A', '#EA5F89'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          },
          legend: {
            position: 'right'
          }
        }
      }
    });

    this.charts.push(chart);
  }

  createBarChart(canvasId: string, title: string, data: Record<string, number>): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Participants',
          data: Object.values(data),
          backgroundColor: '#36A2EB',
          borderColor: '#1E88E5',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Participants'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Activity Type'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          }
        }
      }
    });

    this.charts.push(chart);
  }

  createLineChart(canvasId: string, title: string, data: Record<string, number>): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Participants',
          data: Object.values(data),
          fill: false,
          borderColor: '#4BC0C0',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Participants'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Activity Type'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          }
        }
      }
    });

    this.charts.push(chart);
  }

  destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}