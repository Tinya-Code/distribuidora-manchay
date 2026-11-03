export class DeliverySlot {
  readonly dayOfWeek: number; // 0-6
  readonly start: string; // "09:00"
  readonly end: string; // "13:00"

  constructor(dayOfWeek: number, start: string, end: string) {
    if (dayOfWeek < 0 || dayOfWeek > 6) throw new Error('dayOfWeek must be 0-6');
    this.dayOfWeek = dayOfWeek;
    this.start = start;
    this.end = end;
  }

  label(): string {
    return `${this.start} - ${this.end}`;
  }
}
