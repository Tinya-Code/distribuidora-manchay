import { Order, Quote, Business } from '../../domain';

export interface MessageFormatter {
  formatOrder(order: Order, business: Business): string;
  formatQuote(quote: Quote, business: Business): string;
}
