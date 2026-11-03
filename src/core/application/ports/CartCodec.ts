import { Cart } from '../../domain';

export interface CartCodec {
  encode(cart: Cart): string;
  decode(value: string): Cart | null;
}
