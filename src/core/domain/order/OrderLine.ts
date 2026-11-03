import { ProductId, PresentationId } from '../shared';
import { Money } from '../shared';

export class OrderLine {
  readonly productId: ProductId;
  readonly presentationId: PresentationId;
  readonly productName: string;
  readonly presentationName: string;
  readonly quantity: number;
  readonly unitPrice: Money;
  readonly subtotal: Money;

  constructor(params: {
    productId: ProductId;
    presentationId: PresentationId;
    productName: string;
    presentationName: string;
    quantity: number;
    unitPrice: Money;
  }) {
    if (params.quantity < 1) throw new Error('quantity must be >= 1');
    this.productId = params.productId;
    this.presentationId = params.presentationId;
    this.productName = params.productName;
    this.presentationName = params.presentationName;
    this.quantity = params.quantity;
    this.unitPrice = params.unitPrice;
    this.subtotal = params.unitPrice.multiply(params.quantity);
  }
}
