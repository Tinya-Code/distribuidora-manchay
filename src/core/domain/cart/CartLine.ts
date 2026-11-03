import { ProductId, PresentationId } from '../shared';

export class CartLine {
  readonly productId: ProductId;
  readonly presentationId: PresentationId;
  readonly quantity: number;

  constructor(productId: ProductId, presentationId: PresentationId, quantity: number) {
    if (quantity < 1) throw new Error('quantity must be >= 1');
    this.productId = productId;
    this.presentationId = presentationId;
    this.quantity = quantity;
  }

  withQuantity(quantity: number): CartLine {
    return new CartLine(this.productId, this.presentationId, quantity);
  }

  equals(other: CartLine): boolean {
    return this.productId === other.productId && this.presentationId === other.presentationId;
  }
}
