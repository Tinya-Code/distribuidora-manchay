import { ZoneId } from '../shared';
import { Money } from '../shared';
import { DeliverySlot } from './DeliverySlot';

export class DeliveryZone {
  readonly id: ZoneId;
  readonly name: string;
  readonly shippingCost: Money;
  readonly freeShippingFrom?: Money;
  readonly minOrder: Money;
  readonly deliveryTime: string;
  readonly deliveryDays: readonly number[];
  readonly slots: readonly DeliverySlot[];

  constructor(params: {
    id: ZoneId;
    name: string;
    shippingCost: Money;
    freeShippingFrom?: Money;
    minOrder: Money;
    deliveryTime: string;
    deliveryDays: number[];
    slots?: DeliverySlot[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.shippingCost = params.shippingCost;
    this.freeShippingFrom = params.freeShippingFrom;
    this.minOrder = params.minOrder;
    this.deliveryTime = params.deliveryTime;
    this.deliveryDays = params.deliveryDays;
    this.slots = params.slots ?? [];
  }

  deliversOn(dayOfWeek: number): boolean {
    return this.deliveryDays.includes(dayOfWeek);
  }
}
