import { Cart } from '../../domain';

export interface CartStorage {
  load(): Cart | null;
  save(cart: Cart): void;
  clear(): void;
}
