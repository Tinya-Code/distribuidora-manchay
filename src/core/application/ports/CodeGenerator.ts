import { OrderCode, QuoteCode } from '../../domain';

export interface CodeGenerator {
  generateOrderCode(now: Date): OrderCode;
  generateQuoteCode(now: Date): QuoteCode;
}
