import { CatalogFiltersElement } from './CatalogFiltersElement';
if (typeof customElements !== 'undefined' && !customElements.get('catalog-filters-feature')) {
  customElements.define('catalog-filters-feature', CatalogFiltersElement);
}
export * from './CatalogFiltersElement';
export * from './CatalogFiltersPresenter';
