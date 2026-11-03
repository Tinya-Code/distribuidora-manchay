import { Order } from '../../domain';
import { OrderGateway } from '../../application';
import { Result, ok, err } from '../../domain';

export class BeaconOrderGateway implements OrderGateway {
  constructor(private readonly url: string) {}

  async send(order: Order): Promise<Result<void, string>> {
    const body = JSON.stringify(order);
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const queued = navigator.sendBeacon(this.url, new Blob([body], { type: 'application/json' }));
      return queued ? ok(undefined) : err('beacon not queued');
    }
    try {
      const res = await fetch(this.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
      return res.ok ? ok(undefined) : err(`HTTP ${res.status}`);
    } catch (e) {
      return err(e instanceof Error ? e.message : 'network error');
    }
  }
}
