import { Component, OnInit } from '@angular/core';
import {
  IonicModule,
  ToastController,
  RefresherCustomEvent
} from '@ionic/angular';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StockApiService }    from '../services/stock-api.service';
import { StorageService }     from '../services/storage.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchSymbol    = '';
  stockInfo: any  = null;
  defaultSymbols  = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NFLX', 'NVDA', 'FB'];
  defaultStocks: any[] = [];
  isLoadingDefaults = false;

  constructor(
    private stockApi: StockApiService,
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDefaultStocks();
  }

  private loadDefaultStocks() {
    this.isLoadingDefaults = true;
    const stockRequests: Observable<any>[] = this.defaultSymbols.map(symbol =>
      this.stockApi.getStockPrice(symbol)
    );

    forkJoin(stockRequests).subscribe({
      next: (responses) => {
        this.defaultStocks = responses.map((data, index) => {
          console.log(`Stock ${this.defaultSymbols[index]} response:`, data); // Debug log
          return {
            symbol: this.defaultSymbols[index],
            price: data.c || 'N/A' // Fallback if price is missing
          };
        });
        this.isLoadingDefaults = false;
      },
      error: async (err) => {
        console.error('Error loading default stocks:', err);
        this.isLoadingDefaults = false;
        const toast = await this.toastCtrl.create({
          message: 'Failed to load default stocks. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  searchStock() {
    const symbol = this.searchSymbol.trim().toUpperCase();
    if (!symbol) {
      this.stockInfo = null;
      return;
    }
    this.stockApi.getStockPrice(symbol).subscribe({
      next: (data) => {
        console.log('Search stock response:', data); // Debug log
        this.stockInfo = {
          symbol,
          price: data.c || 'N/A' // Fallback if price is missing
        };
      },
      error: async (err) => {
        console.error('Error fetching stock:', err);
        const toast = await this.toastCtrl.create({
          message: `Failed to fetch stock price for ${symbol}.`,
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
        this.stockInfo = null;
      }
    });
  }

  async addToWatchlist(symbol?: string) {
    const target = symbol ?? this.stockInfo?.symbol;
    if (!target) { return; }
    await this.storageService.addFavorite(target);
    const toast = await this.toastCtrl.create({
      message: `${target} added to watchlist`,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  refresh(event: RefresherCustomEvent) {
    this.loadDefaultStocks();
    setTimeout(() => event.detail.complete(), 500);
  }

  // footer nav
  goToHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
  goToSearch() {
    this.router.navigateByUrl('/search', { replaceUrl: true });
  }
  goToSettings() {
    this.router.navigateByUrl('/settings', { replaceUrl: true });
  }
}