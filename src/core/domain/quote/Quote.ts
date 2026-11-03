import { Money } from '../shared';
import { QuoteCode } from './QuoteCode';

export interface QuoteLine {
  readonly productId: string;
  readonly presentationId: string;
  readonly productName: string;
  readonly presentationName: string;
  readonly quantity: number;
  readonly unitPrice: Money;
  readonly subtotal: Money;
}

export class Quote {
  readonly code: QuoteCode;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly businessName?: string;
  readonly notes?: string;
  readonly lines: readonly QuoteLine[];
  readonly total: Money;
  readonly createdAt: Date;

  constructor(params: {
    code: QuoteCode;
    customerName: string;
    customerPhone: string;
    businessName?: string;
    notes?: string;
    lines: QuoteLine[];
    total: Money;
    createdAt?: Date;
  }) {
    this.code = params.code;
    this.customerName = params.customerName;
    this.customerPhone = params.customerPhone;
    this.businessName = params.businessName;
    this.notes = params.notes;
    this.lines = params.lines;
    this.total = params.total;
    this.createdAt = params.createdAt ?? new Date();
  }
}
