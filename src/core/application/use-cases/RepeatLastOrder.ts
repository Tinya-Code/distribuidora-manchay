import { Cart } from '../../domain';
import { LastOrderStorage, CartStorage } from '../ports';
import { Result, ok, err } from '../../domain';

export class RepeatLastOrder {
  constructor(private readonly cart: Cart, private readonly lastOrderStorage: LastOrderStorage, private readonly cartStorage: CartStorage) {}

  execute(): Result<void, string> {
    const last = this.lastOrderStorage.load();
    if (!last) return err('No last order');
    this.cart.clear();
    for (const line of last.lines) {
      const r = this.cart.add(line.productId as any, line.presentationId as any, line.quantity);
      if (!r.ok) return r;
    }
    this.cartStorage.save(this.cart);
    return ok(undefined);
  }
}
