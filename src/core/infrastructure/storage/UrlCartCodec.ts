import { Cart } from '../../domain';
import { CartCodec } from '../../application';
import { ProductId, PresentationId } from '../../domain';

export class UrlCartCodec implements CartCodec {
  encode(cart: Cart): string {
    const data = { lines: cart.getLines().map((l) => ({ p: l.productId, r: l.presentationId, q: l.quantity })) };
    const json = JSON.stringify(data);
    if (typeof btoa !== 'undefined') return btoa(unescape(encodeURIComponent(json)));
    return Buffer.from(json, 'utf8').toString('base64');
  }

  decode(value: string): Cart | null {
    try {
      let json: string;
      if (typeof atob !== 'undefined') json = decodeURIComponent(escape(atob(value)));
      else json = Buffer.from(value, 'base64').toString('utf8');
      const data = JSON.parse(json) as { lines: { p: string; r: string; q: number }[] };
      const cart = new Cart();
      for (const l of data.lines ?? []) {
        cart.add(l.p as ProductId, l.r as PresentationId, l.q);
      }
      return cart;
    } catch {
      return null;
    }
  }
}
