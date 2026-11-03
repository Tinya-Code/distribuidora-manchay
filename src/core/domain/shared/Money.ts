export class Money {
  readonly amount: number;
  readonly currency: string;

  constructor(amount: number, currency = 'PEN') {
    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency;
  }

  static of(amount: number, currency = 'PEN'): Money {
    return new Money(amount, currency);
  }

  static zero(currency = 'PEN'): Money {
    return new Money(0, currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) throw new Error('Division by zero');
    return new Money(this.amount / divisor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  format(): string {
    const symbol = this.currency === 'PEN' ? 'S/' : this.currency;
    return `${symbol} ${this.amount.toFixed(2)}`;
  }

  toString(): string {
    return this.format();
  }
}
