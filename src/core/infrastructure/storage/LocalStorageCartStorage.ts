import { Cart } from '../../domain';
import { CartStorage } from '../../application';
import { ProductId, PresentationId } from '../../domain';

const KEY = 'cart';

export class LocalStorageCartStorage implements CartStorage {
  private get ls(): Storage | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  }

  load(): Cart | null {
    const ls = this.ls;
    if (!ls) return null;
    const raw = ls.getItem(KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw) as { lines: { productId: string; presentationId: string; quantity: number }[] };
      const cart = new Cart();
      for (const l of data.lines ?? []) {
        cart.add(l.productId as ProductId, l.presentationId as PresentationId, l.quantity);
      }
      return cart;
    } catch {
      return null;
    }
  }

  save(cart: Cart): void {
    const ls = this.ls;
    if (!ls) return;
    const data = { lines: cart.getLines().map((l) => ({ productId: l.productId, presentationId: l.presentationId, quantity: l.quantity })) };
    ls.setItem(KEY, JSON.stringify(data));
  }

  clear(): void {
    this.ls?.removeItem(KEY);
  }
}
