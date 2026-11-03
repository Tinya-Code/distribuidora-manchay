import { Cart, QuoteBuilder, Quote, QuoteCode, Customer, PricingMode } from '../../domain';
import { Money } from '../../domain';
import { CatalogSource, QuoteGateway, MessageFormatter, MessageChannel, CodeGenerator, Clock, Analytics } from '../ports';
import { Business } from '../../domain';
import { SubmitQuoteInput } from '../dto';
import { Result } from '../../domain';

export interface SubmitQuoteResult {
  quote: Quote;
  whatsappLink: string;
  apiResult: Result<void, string> | null;
}

export class SubmitQuote {
  constructor(
    private readonly cart: Cart,
    private readonly catalog: CatalogSource,
    private readonly pricing: any,
    private readonly quoteGateway: QuoteGateway,
    private readonly messageFormatter: MessageFormatter,
    private readonly messageChannel: MessageChannel,
    private readonly codeGenerator: CodeGenerator,
    private readonly clock: Clock,
    private readonly analytics: Analytics,
    private readonly business: Business,
  ) {}

  async execute(input: SubmitQuoteInput): Promise<Result<SubmitQuoteResult, string[]>> {
    const code = this.codeGenerator.generateQuoteCode(this.clock.now());

    const cartLines = this.cart.getLines().map((l) => ({
      productId: l.productId,
      presentationId: l.presentationId,
      quantity: l.quantity,
    }));

    const resolveProduct = (id: any) => this.catalog.products().find((p: any) => p.id === id);
    const resolvePresentation = (pid: any, presId: any) => {
      const p = this.catalog.products().find((x: any) => x.id === pid);
      return p?.presentations.find((pr: any) => pr.id === presId);
    };

    const build = QuoteBuilder.build({
      code,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      businessName: input.businessName,
      notes: input.notes,
      cartLines,
      resolveProduct,
      resolvePresentation,
      pricingMode: input.pricingMode,
      pricingService: this.pricing,
    });

    if (!build.ok) return build as any;

    const quote = build.value;
    const message = this.messageFormatter.formatQuote(quote, this.business);
    const whatsappLink = this.messageChannel.buildLink(message);

    let apiResult: Result<void, string> | null = null;
    this.quoteGateway.send(quote).then((r) => { apiResult = r; }).catch(() => { apiResult = { ok: false, error: 'API failed' }; });

    this.analytics.track('quote_submitted', { code: quote.code.value });

    return { ok: true, value: { quote, whatsappLink, apiResult } };
  }
}
