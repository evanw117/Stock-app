import { Provider } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

// Define a provider using a factory function
export const storageProvider: Provider = {
  provide: Storage,
  useFactory: () => {
    const storage = new Storage();
    storage.create(); // Initialize the storage
    return storage;
  },
};