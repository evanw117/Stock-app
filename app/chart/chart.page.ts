import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { StockApiService } from '../services/stock-api.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

type Range = '1d' | '7d' | '1mo';
type ChartStyle = 'bar' | 'line';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgChartsModule]
})
export class ChartPage {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  stockSymbol: string = '';
  selectedRange: Range = '7d';
  chartType: ChartStyle = 'bar';
  isLoading: boolean = true;
  stockDetails: any;
  apiError: string | null = null;

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Stock Price (7D)',
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  private api = inject(StockApiService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.stockSymbol = this.route.snapshot.paramMap.get('symbol') || '';
    this.loadChartData(this.selectedRange);
  }

  onRangeChange(event: CustomEvent) {
    this.selectedRange = event.detail.value;
    this.loadChartData(this.selectedRange);
  }

  onChartTypeChange(event: CustomEvent) {
    this.chartType = event.detail.value;
    this.chart?.update();
  }

  loadChartData(range: Range) {
    this.isLoading = true;
    this.apiError = null;

    this.api.getHistoricalPrices(this.stockSymbol, range).subscribe({
      next: (response: any) => {
        console.log('Historical API response:', response);

        if (!response || !response.values || response.values.length === 0) {
          this.apiError = 'No chart data found or API limit reached.';
          this.chartData.labels = [];
          this.chartData.datasets[0].data = [];
          this.chart?.update();
          this.isLoading = false;
          return;
        }

        const reversed = [...response.values].reverse();

        this.chartData.labels = reversed.map((entry: any) => new Date(entry.datetime).toLocaleDateString());
        this.chartData.datasets[0].data = reversed.map((entry: any) => entry.close);
        this.chartData.datasets[0].label = `Stock Price (${range.toUpperCase()})`;

        this.stockDetails = {
          c: reversed[reversed.length - 1]?.close ?? 'N/A',
          o: reversed[0]?.open ?? 'N/A',
          h: Math.max(...reversed.map((e: any) => e.high ?? 0)),
          l: Math.min(...reversed.map((e: any) => e.low ?? Infinity)),
          pc: reversed[0]?.close ?? 'N/A'
        };

        this.chart?.update();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.apiError = 'Unable to load chart data. API error occurred.';
        this.isLoading = false;
      }
    });
  }
}
