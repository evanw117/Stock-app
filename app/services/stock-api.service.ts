import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockApiService {
  private apiKey = '6c8aaa56a8574ee181af61dcab156616';
  private baseUrl = 'https://api.twelvedata.com';

  constructor(private http: HttpClient) {}

  getHistoricalPrices(symbol: string, range: '1d' | '7d' | '1mo'): Observable<any> {
    const interval = range === '1d' ? '1min' : range === '7d' ? '1day' : '1day';
    const url = `${this.baseUrl}/time_series?symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}&outputsize=7`;
    return this.http.get<any>(url);
  }

  getStockPrice(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/quote?symbol=${symbol}&apikey=${this.apiKey}`);
  }
}
