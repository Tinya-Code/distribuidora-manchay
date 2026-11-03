import { Order, Result, ok, err, Money } from '../../domain';
import { OrderGateway } from '../../application';
import { CatalogSource } from '../../application';
import { PricingService } from '../../domain';
import { ZonePolicy } from '../../domain';

type PricingMode = 'home' | 'business';

/**
 * Mock del gateway de pedidos para desarrollo.
 * Valida que los precios del pedido coincidan con el catálogo vigente,
 * recalculando subtotal, envío y total. Si no coinciden, rechaza con
 * total_no_coincide. Si coinciden, confirma el pedido (sin red real).
 *
 * Se activa mediante la bandera `features.apiMock` de tenant.config.
 */
export class MockOrderGateway implements OrderGateway {
  constructor(private readonly catalog: CatalogSource, private readonly pricing: PricingService) {}

  async send(order: Order): Promise<Result<void, string>> {
    const currency = order.total.currency;
    let subtotal = Money.zero(currency);

    for (const line of order.lines) {
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

    const zone = this.catalog.zones().find((z) => z.id === order.delivery.zoneId);
    const shipping = zone ? new ZonePolicy().shippingCost(zone, subtotal) : Money.zero(currency);
    const total = subtotal.add(shipping);

    if (total.amount !== order.total.amount) {
      return err('total_no_coincide: El total no coincide con los precios vigentes.');
    }

    return ok(undefined);
  }
}
