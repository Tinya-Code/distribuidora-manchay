import { Cart, CartPolicy, asProductId, asPresentationId } from '@core/domain';

describe('Cart', () => {
  it('adds and increments', () => {
    const cart = new Cart();
    const pid = asProductId('prod1');
    const prid = asPresentationId('pres1');
    expect(cart.add(pid, prid, 2).ok).toBe(true);
    expect(cart.add(pid, prid, 1).ok).toBe(true);
    expect(cart.findLine(pid, prid)?.quantity).toBe(3);
  });
  it('removes', () => {
    const cart = new Cart();
    const pid = asProductId('prod1');
    const prid = asPresentationId('pres1');
    cart.add(pid, prid, 2);
    cart.remove(pid, prid);
    expect(cart.isEmpty()).toBe(true);
  });
  it('change quantity to 0 removes', () => {
    const cart = new Cart();
    const pid = asProductId('prod1');
    const prid = asPresentationId('pres1');
    cart.add(pid, prid, 2);
    cart.changeQuantity(pid, prid, 0);
    expect(cart.isEmpty()).toBe(true);
  });
  it('policy max lines', () => {
    const cart = new Cart(new CartPolicy(99, 1));
    const pid = asProductId('p');
    cart.add(pid, asPresentationId('a'), 1);
    const r = cart.add(asProductId('p2'), asPresentationId('b'), 1);
    expect(r.ok).toBe(false);
  });
});
