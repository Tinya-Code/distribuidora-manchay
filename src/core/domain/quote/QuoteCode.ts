export class QuoteCode {
  readonly value: string;

  constructor(value: string) {
    if (!QuoteCode.isValid(value)) throw new Error(`Invalid quote code: ${value}`);
    this.value = value;
  }

  static isValid(value: string): boolean {
    return /^COT-\d{6}-[A-Z0-9]{4}$/.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: QuoteCode): boolean {
    return this.value === other.value;
  }
}
