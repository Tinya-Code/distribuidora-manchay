import { Cart } from '../../domain';
import { CartCodec } from '../ports';

export class ShareCart {
  constructor(private readonly cart: Cart, private readonly codec: CartCodec) {}

  execute(): string {
    return this.codec.encode(this.cart);
  }
}
