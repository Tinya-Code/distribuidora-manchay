export class CartPolicy {
  readonly maxQtyPerLine: number;
  readonly maxLines: number;

  constructor(maxQtyPerLine = 99, maxLines = 50) {
    if (maxQtyPerLine < 1) throw new Error('maxQtyPerLine must be >= 1');
    if (maxLines < 1) throw new Error('maxLines must be >= 1');
    this.maxQtyPerLine = maxQtyPerLine;
    this.maxLines = maxLines;
  }
}
