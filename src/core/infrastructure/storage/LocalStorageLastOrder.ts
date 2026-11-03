import { Order } from '../../domain';
import { LastOrderStorage } from '../../application';

const KEY = 'lastOrder';

export class LocalStorageLastOrder implements LastOrderStorage {
  private get ls(): Storage | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  }

  load(): Order | null {
    const ls = this.ls;
    if (!ls) return null;
    const raw = ls.getItem(KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Order;
    } catch {
      return null;
    }
  }

  save(order: Order): void {
    this.ls?.setItem(KEY, JSON.stringify(order));
  }

  clear(): void {
    this.ls?.removeItem(KEY);
  }
}
