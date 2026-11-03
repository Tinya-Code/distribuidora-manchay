import {
  Cart, OrderBuilder, Order, OrderCode, Customer, PricingMode, DeliveryZone, ZonePolicy,
  PaymentMethod, Product, Presentation, Money,
} from '../../domain';
import { PricingService } from '../../domain';
import { CatalogSource, OrderGateway, MessageFormatter, MessageChannel, CodeGenerator, Clock, LastOrderStorage, Analytics } from '../ports';
import { Business } from '../../domain';
import { SubmitOrderInput } from '../dto';
import { Result } from '../../domain';

export interface SubmitOrderResult {
  order: Order;
  whatsappLink: string;
  apiResult: Result<void, string> | null;
}

export class SubmitOrder {
  constructor(
    private readonly cart: Cart,
    private readonly catalog: CatalogSource,
    private readonly pricing: PricingService,
    private readonly orderGateway: OrderGateway,
    private readonly messageFormatter: MessageFormatter,
    private readonly messageChannel: MessageChannel,
    private readonly codeGenerator: CodeGenerator,
    private readonly clock: Clock,
    private readonly lastOrderStorage: LastOrderStorage,
    private readonly analytics: Analytics,
    private readonly business: Business,
  ) {}

  async execute(input: SubmitOrderInput): Promise<Result<SubmitOrderResult, string[]>> {
    const zone = this.catalog.zones().find((z) => String(z.id) === input.zoneId);
    if (!zone) return { ok: false, error: ['Delivery zone not found'] };

    const code = this.codeGenerator.generateOrderCode(this.clock.now());
    const customer = new Customer({
      type: input.customerType,
      name: input.customerName,
      businessName: input.businessName,
      phone: input.customerPhone,
      document: input.document,
    });

    const cartLines = this.cart.getLines().map((l) => ({
      productId: l.productId,
      presentationId: l.presentationId,
      quantity: l.quantity,
    }));

    const resolveProduct = (id: any) => this.catalog.products().find((p) => p.id === id);
    const resolvePresentation = (pid: any, presId: any) => {
      const p = this.catalog.products().find((x) => x.id === pid);
      return p?.presentations.find((pr) => pr.id === presId);
    };

    const build = OrderBuilder.build({
      code,
      customer,
      cartLines,
      resolveProduct,
      resolvePresentation,
      pricingMode: input.pricingMode,
      pricingService: this.pricing,
      zone,
      delivery: {
        address: input.address,
        reference: input.reference,
        date: input.date,
        slot: input.slot,
      },
      payment: {
        method: input.paymentMethod,
        cashAmount: input.cashAmount !== undefined ? new Money(input.cashAmount) : undefined,
      },
      invoice: input.invoice,
      notes: input.notes,
    });

    if (!build.ok) return build as any;

    const order = build.value;
    const message = this.messageFormatter.formatOrder(order, this.business);
    const whatsappLink = this.messageChannel.buildLink(message);

    // fire and forget API
    let apiResult: Result<void, string> | null = null;
    this.orderGateway.send(order).then((r) => { apiResult = r; }).catch(() => { apiResult = { ok: false, error: 'API failed' }; });

    this.lastOrderStorage.save(order);
    this.analytics.track('order_submitted', { code: order.code.value });

    return { ok: true, value: { order, whatsappLink, apiResult } };
  }
}
