import { Order } from '../../domain';
import { OrderGateway } from '../../application';
import { Result, ok } from '../../domain';

export class NullOrderGateway implements OrderGateway {
  async send(_order: Order): Promise<Result<void, string>> {
    return ok(undefined);
  }
}
