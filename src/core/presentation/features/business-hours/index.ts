import { BusinessHoursElement } from './BusinessHoursElement';
if (typeof customElements !== 'undefined' && !customElements.get('business-hours-feature')) {
  customElements.define('business-hours-feature', BusinessHoursElement);
}
export * from './BusinessHoursElement';
export * from './BusinessHoursPresenter';
