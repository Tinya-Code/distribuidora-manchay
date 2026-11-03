import { CartElement } from './CartElement';
if (typeof customElements !== 'undefined' && !customElements.get('dist-cart')) {
  customElements.define('dist-cart', CartElement);
}
export * from './CartElement';
export * from './CartPresenter';
