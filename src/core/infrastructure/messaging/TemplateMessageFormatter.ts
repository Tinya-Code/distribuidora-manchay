import { MessageFormatter } from '../../application';
import { Order, Quote, Business } from '../../domain';
import { defaultOrderTemplate, defaultQuoteTemplate } from './templates';

function render(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] ?? ''));
}

export class TemplateMessageFormatter implements MessageFormatter {
  constructor(
    private readonly orderTemplate = defaultOrderTemplate,
    private readonly quoteTemplate = defaultQuoteTemplate,
  ) {}

  formatOrder(order: Order, business: Business): string {
    return render(this.orderTemplate, {
      code: order.code.value,
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      zone: String(order.delivery.zoneId),
      address: order.delivery.address,
      total: order.total.format(),
      businessName: business.name,
    });
  }

  formatQuote(quote: Quote, business: Business): string {
    return render(this.quoteTemplate, {
      code: quote.code.value,
      customerName: quote.customerName,
      customerPhone: quote.customerPhone,
      total: quote.total.format(),
      businessName: business.name,
    });
  }
}
