import { Order } from '../../domain';
import { OrderGateway } from '../../application';
import { Result, ok, err } from '../../domain';

export class HttpOrderGateway implements OrderGateway {
  constructor(private readonly baseUrl: string, private readonly path = '/api/pedidos') {}

  async send(order: Order): Promise<Result<void, string>> {
    try {
      const res = await fetch(`${this.baseUrl}${this.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!res.ok) return err(`HTTP ${res.status}`);
      return ok(undefined);
    } catch (e) {
      return err(e instanceof Error ? e.message : 'network error');
    }
  }
}
