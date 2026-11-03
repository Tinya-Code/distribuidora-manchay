import { PricingMode } from '../../domain';
import { CustomerPrefsStorage } from '../ports';

export class SwitchPricingMode {
  constructor(private readonly prefs: CustomerPrefsStorage) {}

  execute(mode: PricingMode): void {
    const current = this.prefs.load();
    this.prefs.save({ mode, customer: current?.customer });
  }
}
