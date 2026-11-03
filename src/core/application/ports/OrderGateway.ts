import { Order } from '../../domain';
import { Result } from '../../domain';

export interface OrderGateway {
  send(order: Order): Promise<Result<void, string>>;
}
