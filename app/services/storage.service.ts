import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private FAVORITES_KEY = 'favorites';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  /**
   * Generic setter for any key/value pair
   */
  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  /**
   * Generic getter for any key/value pair
   */
  async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  /**
   * Store an array of favorite symbols
   */
  async setFavorites(symbols: string[]): Promise<void> {
    await this.set(this.FAVORITES_KEY, symbols);
  }

  /**
   * Retrieve the array of favorite symbols
   */
  async getFavorites(): Promise<string[]> {
    const favs = await this.get(this.FAVORITES_KEY);
    return Array.isArray(favs) ? favs : [];
  }

  /**
   * Add a symbol to favorites (avoids duplicates)
   */
  async addFavorite(symbol: string): Promise<void> {
    const current = await this.getFavorites();
    const updated = Array.from(new Set([...current, symbol]));
    await this.setFavorites(updated);
  }

  /**
   * Remove a symbol from favorites
   */
  async removeFavorite(symbol: string): Promise<void> {
    const current = await this.getFavorites();
    const updated = current.filter(s => s !== symbol);
    await this.setFavorites(updated);
  }
}
