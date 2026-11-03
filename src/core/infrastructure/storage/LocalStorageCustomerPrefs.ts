import { CustomerPrefs, CustomerPrefsStorage } from '../../application';

const KEY = 'customerPrefs';

export class LocalStorageCustomerPrefs implements CustomerPrefsStorage {
  private get ls(): Storage | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  }

  load(): CustomerPrefs | null {
    const ls = this.ls;
    if (!ls) return null;
    const raw = ls.getItem(KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CustomerPrefs;
    } catch {
      return null;
    }
  }

  save(prefs: CustomerPrefs): void {
    this.ls?.setItem(KEY, JSON.stringify(prefs));
  }

  clear(): void {
    this.ls?.removeItem(KEY);
  }
}
