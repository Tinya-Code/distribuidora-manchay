import { Order } from '../../domain';
import { OrderGateway } from '../../application';
import { Result } from '../../domain';

export class CompositeOrderGateway implements OrderGateway {
  constructor(private readonly primary: OrderGateway, private readonly fallback: OrderGateway) {}

  async send(order: Order): Promise<Result<void, string>> {
    const r = await this.primary.send(order);
    if (r.ok) return r;
    return this.fallback.send(order);
  }
}
