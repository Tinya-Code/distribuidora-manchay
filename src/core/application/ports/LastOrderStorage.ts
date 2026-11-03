import { Order } from '../../domain';

export interface LastOrderStorage {
  load(): Order | null;
  save(order: Order): void;
  clear(): void;
}
