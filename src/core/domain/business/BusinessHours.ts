export class BusinessHours {
  readonly openTime: string;
  readonly closeTime: string;
  readonly days: readonly number[];
  readonly cutoffTime?: string;

  constructor(params: { openTime: string; closeTime: string; days: number[]; cutoffTime?: string }) {
    this.openTime = params.openTime;
    this.closeTime = params.closeTime;
    this.days = params.days;
    this.cutoffTime = params.cutoffTime;
  }

  private toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + (m ?? 0);
  }

  isOpenAt(date: Date): boolean {
    if (!this.days.includes(date.getDay())) return false;
    const now = date.getHours() * 60 + date.getMinutes();
    const open = this.toMinutes(this.openTime);
    const close = this.toMinutes(this.closeTime);
    if (close <= open) {
      // overnight
      return now >= open || now < close;
    }
    return now >= open && now < close;
  }

  deliversToday(date: Date): boolean {
    if (!this.days.includes(date.getDay())) return false;
    if (!this.cutoffTime) return true;
    const now = date.getHours() * 60 + date.getMinutes();
    return now < this.toMinutes(this.cutoffTime);
  }

  statusText(date: Date): string {
    if (this.isOpenAt(date)) {
      return `Abierto ahora, entrega hoy hasta las ${this.cutoffTime ?? this.closeTime}`;
    }
    // next open
    return `Cerrado, te respondemos mañana desde las ${this.openTime}`;
  }
}
