import { QuoteElement } from './QuoteElement';
if (typeof customElements !== 'undefined' && !customElements.get('quote-feature')) {
  customElements.define('quote-feature', QuoteElement);
}
export * from './QuoteElement';
export * from './QuotePresenter';
