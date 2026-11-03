import { ProductId, PresentationId, Result } from '../../domain';
import { Cart } from '../../domain';
import { CartStorage } from '../ports';

export class ChangeQuantity {
  constructor(private readonly cart: Cart, private readonly storage: CartStorage) {}

  execute(productId: ProductId, presentationId: PresentationId, quantity: number): Result<void, string> {
    const r = this.cart.changeQuantity(productId, presentationId, quantity);
    if (r.ok) this.storage.save(this.cart);
    return r;
  }
}
