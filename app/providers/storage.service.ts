import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Initialize the storage with custom configuration
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Set a key-value pair in storage
  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  // Get a value from storage by key
  async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  // Remove a key from storage
  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  // Clear all storage
  async clear(): Promise<void> {
    await this._storage?.clear();
  }

  // ✅ Add getFavorites for watchlist
  async getFavorites(): Promise<string[]> {
    return (await this._storage?.get('favorites')) || [];
  }

  // ✅ Add setFavorites to update watchlist
  async setFavorites(favorites: string[]): Promise<void> {
    await this._storage?.set('favorites', favorites);
  }

  // ✅ Remove a stock from favorites
  async removeFavorite(symbol: string): Promise<void> {
    const current = await this.getFavorites();
    const updated = current.filter(item => item !== symbol);
    await this.setFavorites(updated);
    
  }
  // Removed duplicate set method to avoid conflict
  async setFavorites(favorites: string[]): Promise<void> {
    await this._storage?.set('favorites', favorites);
  }
  
}
