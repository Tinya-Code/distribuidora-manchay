import { Store } from '@core/composition';

describe('Store', () => {
  it('notifies subscribers', () => {
    const store = new Store(0);
    let seen = 0;
    const unsub = store.subscribe((v) => { seen = v; });
    store.set(5);
    expect(seen).toBe(5);
    unsub();
    store.set(9);
    expect(seen).toBe(5);
  });
});
