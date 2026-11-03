import { Cart } from '../../domain';
import { CartCodec, CartStorage } from '../ports';
import { Result, ok, err } from '../../domain';

export class LoadSharedCart {
  constructor(private readonly cart: Cart, private readonly codec: CartCodec, private readonly storage: CartStorage) {}

  execute(value: string): Result<void, string> {
    const decoded = this.codec.decode(value);
    if (!decoded) return err('Invalid cart link');
    // copy lines
    this.cart.clear();
    for (const line of decoded.getLines()) {
      const r = this.cart.add(line.productId, line.presentationId, line.quantity);
      if (!r.ok) return r;
    }
    this.storage.save(this.cart);
    return ok(undefined);
  }
}
