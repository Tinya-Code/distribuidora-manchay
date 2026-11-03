import { Business, BusinessHours } from '../../domain';
import { Clock } from '../ports';

export interface BusinessOpenStatus {
  open: boolean;
  deliversToday: boolean;
  message: string;
}

export class CheckBusinessOpen {
  constructor(private readonly business: Business, private readonly clock: Clock) {}

  execute(): BusinessOpenStatus {
    const now = this.clock.now();
    const open = this.business.hours.isOpenAt(now);
    const deliversToday = this.business.hours.deliversToday(now);
    const message = this.business.hours.statusText(now);
    return { open, deliversToday, message };
  }
}
