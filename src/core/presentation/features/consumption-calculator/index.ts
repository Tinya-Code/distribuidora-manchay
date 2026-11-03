import { ConsumptionCalculatorElement } from './ConsumptionCalculatorElement';
if (typeof customElements !== 'undefined' && !customElements.get('consumption-calculator-feature')) {
  customElements.define('consumption-calculator-feature', ConsumptionCalculatorElement);
}
export * from './ConsumptionCalculatorElement';
export * from './ConsumptionCalculatorPresenter';
