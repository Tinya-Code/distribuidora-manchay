import { QuickOrderElement } from './QuickOrderElement';
if (typeof customElements !== 'undefined' && !customElements.get('quick-order-feature')) {
  customElements.define('quick-order-feature', QuickOrderElement);
}
export * from './QuickOrderElement';
export * from './QuickOrderPresenter';
