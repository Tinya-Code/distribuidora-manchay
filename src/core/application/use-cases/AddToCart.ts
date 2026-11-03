import { ProductId, PresentationId, Result } from '../../domain';
import { Cart } from '../../domain';
import { CartStorage } from '../ports';

export class AddToCart {
  constructor(private readonly cart: Cart, private readonly storage: CartStorage) {}

  execute(productId: ProductId, presentationId: PresentationId, quantity = 1): Result<void, string> {
    const r = this.cart.add(productId, presentationId, quantity);
    if (r.ok) this.storage.save(this.cart);
    return r;
  }
}
