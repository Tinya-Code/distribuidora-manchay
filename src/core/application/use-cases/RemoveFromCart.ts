import { ProductId, PresentationId } from '../../domain';
import { Cart } from '../../domain';
import { CartStorage } from '../ports';

export class RemoveFromCart {
  constructor(private readonly cart: Cart, private readonly storage: CartStorage) {}

  execute(productId: ProductId, presentationId: PresentationId): void {
    this.cart.remove(productId, presentationId);
    this.storage.save(this.cart);
  }
}
