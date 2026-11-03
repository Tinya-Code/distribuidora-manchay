import { getContainer } from '../../../composition';
import { ProductId, PresentationId, PricingMode } from '../../../domain';
import { CartPresenter, CartLineView } from './CartPresenter';
import { PreviewCartTotals } from '../../../application';

export class CartElement extends HTMLElement {
  private cartStore: ReturnType<typeof getContainer>['cartStore'] | null = null;
  private container: ReturnType<typeof getContainer> | null = null;
  private presenter: CartPresenter | null = null;
  private unsubscribe: (() => void) | null = null;

  connectedCallback() {
    try {
      this.container = getContainer();
    } catch {
      return;
    }
    this.cartStore = this.container.cartStore;
    this.presenter = new CartPresenter(this.container.pricingService ?? (this.container as any).pricing);
    // pricingService may not exist on container; fallback to a new one
    if (!this.presenter) return;

    this.unsubscribe = this.cartStore.subscribe(() => this.render());
    this.render();
    this.addEventListener('click', this.handleClick.bind(this));
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  private handleClick(e: Event) {
    const target = e.target as HTMLElement;
    const line = target.closest('[data-line]') as HTMLElement | null;
    if (!line) return;
    const productId = line.getAttribute('data-product-id') as string;
    const presentationId = line.getAttribute('data-presentation-id') as string;
    const qtyEl = line.querySelector('[data-line-qty]') as HTMLElement;

    if (target.hasAttribute('data-line-inc')) {
      const q = parseInt(qtyEl.textContent || '1', 10) + 1;
      this.container?.cartStore.changeQuantity(productId as ProductId, presentationId as PresentationId, q);
    } else if (target.hasAttribute('data-line-dec')) {
      const q = Math.max(1, parseInt(qtyEl.textContent || '1', 10) - 1);
      this.container?.cartStore.changeQuantity(productId as ProductId, presentationId as PresentationId, q);
    } else if (target.hasAttribute('data-line-remove')) {
      this.container?.cartStore.removeFromCart(productId as ProductId, presentationId as PresentationId);
    }
  }

  private render() {
    if (!this.container || !this.cartStore || !this.presenter) return;
    const cart = this.container.cart;
    const linesContainer = this.querySelector('[data-cart-lines]') as HTMLElement;
    const template = this.querySelector('[data-cart-line-template]') as HTMLTemplateElement;
    if (!linesContainer || !template) return;

    linesContainer.innerHTML = '';
    const mode: PricingMode = (this.container.pricingModeStore?.get() ?? 'home') as PricingMode;

    for (const line of cart.getLines()) {
      const product = this.container.catalog.products().find((p: any) => p.id === line.productId);
      const presentation = product?.presentations.find((pr: any) => pr.id === line.presentationId);
      if (!product || !presentation) continue;

      const view = this.presenter.lineView(
        String(line.productId),
        String(line.presentationId),
        line.quantity,
        product.name,
        presentation.name,
        presentation,
        mode,
      );

      const clone = template.content.cloneNode(true) as DocumentFragment;
      const root = clone.querySelector('[data-line]') as HTMLElement;
      root.setAttribute('data-product-id', view.productId);
      root.setAttribute('data-presentation-id', view.presentationId);
      const nameEl = root.querySelector('[data-line-name]') as HTMLElement;
      const presEl = root.querySelector('[data-line-presentation]') as HTMLElement;
      const priceEl = root.querySelector('[data-line-price]') as HTMLElement;
      const qtyEl = root.querySelector('[data-line-qty]') as HTMLElement;
      nameEl.textContent = view.name;
      presEl.textContent = view.presentation;
      priceEl.textContent = view.price;
      qtyEl.textContent = String(view.quantity);
      linesContainer.appendChild(clone);
    }

    // Totals
    const preview = new PreviewCartTotals(this.container.catalog, this.container.pricingService ?? (this.container as any).pricing);
    const totals = preview.execute(cart, mode);
    const subtotalEl = this.querySelector('[data-cart-subtotal]') as HTMLElement;
    const shippingEl = this.querySelector('[data-cart-shipping]') as HTMLElement;
    const totalEl = this.querySelector('[data-cart-total]') as HTMLElement;
    if (subtotalEl) subtotalEl.textContent = totals.subtotal.format();
    if (shippingEl) shippingEl.textContent = totals.shipping.format();
    if (totalEl) totalEl.textContent = totals.total.format();
  }
}
