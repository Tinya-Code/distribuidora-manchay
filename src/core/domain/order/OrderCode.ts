export class OrderCode {
  readonly value: string;

  constructor(value: string) {
    if (!OrderCode.isValid(value)) throw new Error(`Invalid order code: ${value}`);
    this.value = value;
  }

  static isValid(value: string): boolean {
    return /^PED-\d{6}-[A-Z0-9]{4}$/.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: OrderCode): boolean {
    return this.value === other.value;
  }
}
