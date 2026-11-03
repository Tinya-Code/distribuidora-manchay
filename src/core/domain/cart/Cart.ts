import { ProductId, PresentationId } from '../shared';
import { Result, ok, err } from '../shared';
import { CartLine } from './CartLine';
import { CartPolicy } from './CartPolicy';

export class Cart {
  private lines: CartLine[];
  readonly policy: CartPolicy;

  constructor(policy?: CartPolicy, lines: CartLine[] = []) {
    this.policy = policy ?? new CartPolicy();
    this.lines = [...lines];
  }

  getLines(): readonly CartLine[] {
    return this.lines;
  }

  findLine(productId: ProductId, presentationId: PresentationId): CartLine | undefined {
    return this.lines.find((l) => l.productId === productId && l.presentationId === presentationId);
  }

  add(productId: ProductId, presentationId: PresentationId, quantity = 1): Result<void, string> {
    if (quantity < 1) return err('Quantity must be >= 1');
    if (quantity > this.policy.maxQtyPerLine) return err(`Quantity exceeds max per line (${this.policy.maxQtyPerLine})`);

    const existing = this.findLine(productId, presentationId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > this.policy.maxQtyPerLine) return err(`Quantity exceeds max per line (${this.policy.maxQtyPerLine})`);
      this.lines = this.lines.map((l) =>
        l.productId === productId && l.presentationId === presentationId
          ? l.withQuantity(newQty)
          : l,
      );
      return ok(undefined);
    }

    if (this.lines.length >= this.policy.maxLines) {
      return err(`Cart has reached max lines (${this.policy.maxLines})`);
    }
    this.lines = [...this.lines, new CartLine(productId, presentationId, quantity)];
    return ok(undefined);
  }

  changeQuantity(productId: ProductId, presentationId: PresentationId, quantity: number): Result<void, string> {
    if (quantity < 0) return err('Quantity cannot be negative');
    if (quantity === 0) {
      this.remove(productId, presentationId);
      return ok(undefined);
    }
    if (quantity > this.policy.maxQtyPerLine) return err(`Quantity exceeds max per line (${this.policy.maxQtyPerLine})`);
    const existing = this.findLine(productId, presentationId);
    if (!existing) return err('Line not found');
    this.lines = this.lines.map((l) =>
      l.productId === productId && l.presentationId === presentationId
        ? l.withQuantity(quantity)
        : l,
    );
    return ok(undefined);
  }

  remove(productId: ProductId, presentationId: PresentationId): void {
    this.lines = this.lines.filter((l) => !(l.productId === productId && l.presentationId === presentationId));
  }

  clear(): void {
    this.lines = [];
  }

  totalQuantity(): number {
    return this.lines.reduce((s, l) => s + l.quantity, 0);
  }

  isEmpty(): boolean {
    return this.lines.length === 0;
  }
}
