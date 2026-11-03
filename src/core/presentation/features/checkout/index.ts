import { CheckoutElement } from './CheckoutElement';
if (typeof customElements !== 'undefined' && !customElements.get('checkout-feature')) {
  customElements.define('checkout-feature', CheckoutElement);
}
export * from './CheckoutElement';
export * from './CheckoutPresenter';
