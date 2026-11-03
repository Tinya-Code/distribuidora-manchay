import { Cart } from '../../domain';
import { CartStorage } from '../../application';

export class MemoryCartStorage implements CartStorage {
  private cart: Cart | null = null;

  load(): Cart | null {
    return this.cart;
  }
  save(cart: Cart): void {
    this.cart = cart;
  }
  clear(): void {
    this.cart = null;
  }
}
