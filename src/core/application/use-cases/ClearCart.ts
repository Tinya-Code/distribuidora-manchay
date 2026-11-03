import { Cart } from '../../domain';
import { CartStorage } from '../ports';

export class ClearCart {
  constructor(private readonly cart: Cart, private readonly storage: CartStorage) {}

  execute(): void {
    this.cart.clear();
    this.storage.clear();
  }
}
