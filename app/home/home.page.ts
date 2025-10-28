// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { IonicModule }       from '@ionic/angular';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { StockApiService }   from '../services/stock-api.service';
import { StorageService }    from '../services/storage.service';
import { NgChartsModule }    from 'ng2-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, NgChartsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  favoriteStocks: string[] = [];
  stockData: any[] = [];
  darkMode = false;

  constructor(
    private stockApi: StockApiService,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.darkMode = document.body.classList.contains('dark');

    this.favoriteStocks = await this.storageService.getFavorites();
    if (!this.favoriteStocks.length) {
      this.favoriteStocks = ['AAPL', 'GOOGL', 'MSFT'];
      await this.storageService.setFavorites(this.favoriteStocks);
    }
    this.loadPrices();
  }

  loadPrices() {
    this.stockData = [];
    this.favoriteStocks.forEach(symbol => {
      this.stockApi.getHistoricalPrices(symbol, '7d').subscribe((data: any) => {
        const vals       = data?.values ?? [];
        const rev        = [...vals].reverse();
        const currentRaw = rev.pop()?.close;
        const current    = currentRaw != null ? Number(currentRaw) : null;
        const prevRaw    = rev[0]?.open;
        const previous   = prevRaw != null ? Number(prevRaw) : null;
        const changePct  = (current !== null && previous !== null && previous !== 0)
          ? +(((current - previous) / previous) * 100).toFixed(2)
          : 0;

        this.stockData.push({
          symbol,
          price: current !== null && !isNaN(current)
                  ? current.toFixed(2)
                  : 'N/A',
          change: changePct,
          sparkline: rev.map((e: any) => Number(e.close) || 0)
        });
      });
    });
  }

  async removeStock(symbol: string) {
    await this.storageService.removeFavorite(symbol);
    this.favoriteStocks = await this.storageService.getFavorites();
    this.loadPrices();
  }

  goToChart(symbol: string) {
    this.router.navigateByUrl(`/chart/${symbol}`);
  }

  // Footer navigation methods
  goToHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  goToSearch() {
    this.router.navigateByUrl('/search', { replaceUrl: true });
  }

  goToSettings() {
    this.router.navigateByUrl('/settings', { replaceUrl: true });
  }

  // Generic navigation helper
  navigate(path: string) {
    const route = path.startsWith('/') ? path : `/${path}`;
    this.router.navigateByUrl(route, { replaceUrl: true });
  }

  getChartData(sparkline: number[]) {
    return {
      labels: sparkline.map((_, i) => i + 1),
      datasets: [{
        data: sparkline,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'transparent',
        pointRadius: 0,
        tension: 0.4
      }]
    };
  }

  toggleDarkMode(event: CustomEvent) {
    this.darkMode = event.detail.checked;
    document.body.classList.toggle('dark', this.darkMode);
  }
}
