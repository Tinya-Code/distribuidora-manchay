import { Quote, Result, ok, err, Money } from '../../domain';
import { QuoteGateway } from '../../application';
import { CatalogSource } from '../../application';
import { PricingService } from '../../domain';

type PricingMode = 'home' | 'business';

/**
 * Mock del gateway de cotizaciones para desarrollo.
 * Valida que los precios de la cotización coincidan con el catálogo vigente.
 * Se activa mediante la bandera `features.apiMock` de tenant.config.
 */
export class MockQuoteGateway implements QuoteGateway {
  constructor(private readonly catalog: CatalogSource, private readonly pricing: PricingService) {}

  async send(quote: Quote): Promise<Result<void, string>> {
    const currency = quote.total.currency;
    let subtotal = Money.zero(currency);

    for (const line of quote.lines) {
      const product = this.catalog.products().find((p) => p.id === line.productId);
      if (!product) return err(`total_no_coincide: Producto no encontrado: ${line.productId}`);

      const presentation = product.presentations.find((pr) => pr.id === line.presentationId);
      if (!presentation) return err(`total_no_coincide: Presentación no encontrada: ${line.presentationId}`);

      let matched = false;
      for (const mode of ['home', 'business'] as PricingMode[]) {
        const price = this.pricing.unitPrice(presentation, line.quantity, mode);
        if (price.amount === line.unitPrice.amount && price.currency === currency) {
          matched = true;
          subtotal = subtotal.add(price.multiply(line.quantity));
          break;
        }
      }
      if (!matched) {
        return err(`total_no_coincide: Precio no coincide para ${line.productName} (qty ${line.quantity})`);
      }
    }

    if (subtotal.amount !== quote.total.amount) {
      return err('total_no_coincide: El total no coincide con los precios vigentes.');
    }

    return ok(undefined);
  }
}
