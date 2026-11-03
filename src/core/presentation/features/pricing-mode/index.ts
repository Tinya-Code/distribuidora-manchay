import { PricingModeElement } from './PricingModeElement';
if (typeof customElements !== 'undefined' && !customElements.get('pricing-mode-feature')) {
  customElements.define('pricing-mode-feature', PricingModeElement);
}
export * from './PricingModeElement';
export * from './PricingModePresenter';
