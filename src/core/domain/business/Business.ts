import { BusinessHours } from './BusinessHours';

export class Business {
  readonly name: string;
  readonly slogan?: string;
  readonly phone: string;
  readonly whatsapp: string;
  readonly email?: string;
  readonly address: string;
  readonly hours: BusinessHours;
  readonly features: Record<string, boolean>;

  constructor(params: {
    name: string;
    slogan?: string;
    phone: string;
    whatsapp: string;
    email?: string;
    address: string;
    hours: BusinessHours;
    features?: Record<string, boolean>;
  }) {
    this.name = params.name;
    this.slogan = params.slogan;
    this.phone = params.phone;
    this.whatsapp = params.whatsapp;
    this.email = params.email;
    this.address = params.address;
    this.hours = params.hours;
    this.features = params.features ?? {};
  }
}
