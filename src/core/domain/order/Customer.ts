export type CustomerType = 'home' | 'business';

export class Customer {
  readonly type: CustomerType;
  readonly name: string;
  readonly businessName?: string;
  readonly phone: string;
  readonly document?: string;

  constructor(params: {
    type: CustomerType;
    name: string;
    businessName?: string;
    phone: string;
    document?: string;
  }) {
    if (!params.name.trim()) throw new Error('name is required');
    if (!params.phone.trim()) throw new Error('phone is required');
    this.type = params.type;
    this.name = params.name.trim();
    this.businessName = params.businessName?.trim();
    this.phone = params.phone.trim();
    this.document = params.document?.trim();
  }
}
