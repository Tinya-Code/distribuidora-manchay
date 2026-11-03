import { Cart, asProductId, asPresentationId } from '@core/domain';
import { UrlCartCodec } from '@core/infrastructure';

describe('UrlCartCodec', () => {
  it('roundtrips cart', () => {
    const cart = new Cart();
    cart.add(asProductId('p1'), asPresentationId('r1'), 3);
    const codec = new UrlCartCodec();
    const encoded = codec.encode(cart);
    const decoded = codec.decode(encoded);
    expect(decoded?.getLines().length).toBe(1);
    expect(decoded?.getLines()[0].quantity).toBe(3);
  });
  it('invalid returns null', () => {
    const codec = new UrlCartCodec();
    expect(codec.decode('!!!')).toBeNull();
  });
});
