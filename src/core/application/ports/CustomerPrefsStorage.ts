import { PricingMode, Customer } from '../../domain';

export interface CustomerPrefs {
  mode: PricingMode;
  customer?: Customer;
}

export interface CustomerPrefsStorage {
  load(): CustomerPrefs | null;
  save(prefs: CustomerPrefs): void;
  clear(): void;
}
