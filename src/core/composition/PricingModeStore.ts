import { PricingMode } from '../domain';
import { CustomerPrefsStorage } from '../application';
import { Store } from './Store';

export class PricingModeStore extends Store<PricingMode> {
  constructor(private readonly prefs: CustomerPrefsStorage, initial: PricingMode = 'home') {
    const loaded = prefs.load();
    super(loaded?.mode ?? initial);
  }

  setMode(mode: PricingMode): void {
    this.set(mode);
    const current = this.prefs.load();
    this.prefs.save({ mode, customer: current?.customer });
  }
}
