import { ZoneId } from '../shared';
import { Money } from '../shared';
import { OrderCode } from './OrderCode';
import { Customer } from './Customer';
import { OrderLine } from './OrderLine';

export type PaymentMethod = 'cash' | 'yape' | 'plin' | 'transfer';
export type InvoiceType = 'boleta' | 'factura';

export interface OrderDelivery {
  readonly zoneId: ZoneId;
  readonly address: string;
  readonly reference?: string;
  readonly date?: string;
  readonly slot?: string;
}

export interface OrderPayment {
  readonly method: PaymentMethod;
  readonly cashAmount?: Money;
}

export class Order {
  readonly code: OrderCode;
  readonly customer: Customer;
  readonly lines: readonly OrderLine[];
  readonly delivery: OrderDelivery;
  readonly payment: OrderPayment;
  readonly invoice: InvoiceType;
  readonly notes?: string;
  readonly subtotal: Money;
  readonly discount: Money;
  readonly shipping: Money;
  readonly total: Money;
  readonly createdAt: Date;

  constructor(params: {
    code: OrderCode;
    customer: Customer;
    lines: OrderLine[];
    delivery: OrderDelivery;
    payment: OrderPayment;
    invoice: InvoiceType;
    notes?: string;
    subtotal: Money;
    discount: Money;
    shipping: Money;
    total: Money;
    createdAt?: Date;
  }) {
    this.code = params.code;
    this.customer = params.customer;
    this.lines = params.lines;
    this.delivery = params.delivery;
    this.payment = params.payment;
    this.invoice = params.invoice;
    this.notes = params.notes;
    this.subtotal = params.subtotal;
    this.discount = params.discount;
    this.shipping = params.shipping;
    this.total = params.total;
    this.createdAt = params.createdAt ?? new Date();
  }
}
