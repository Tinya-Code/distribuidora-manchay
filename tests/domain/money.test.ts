import { Money } from '@core/domain';

describe('Money', () => {
  it('adds and subtracts', () => {
    const a = new Money(10);
    const b = new Money(3.5);
    expect(a.add(b).amount).toBe(13.5);
    expect(a.subtract(b).amount).toBe(6.5);
  });
  it('multiplies', () => {
    expect(new Money(2.5).multiply(3).amount).toBe(7.5);
  });
  it('formats PEN', () => {
    expect(new Money(1.5).format()).toBe('S/ 1.50');
  });
  it('equals', () => {
    expect(new Money(1.5).equals(new Money(1.5))).toBe(true);
    expect(new Money(1.5).equals(new Money(2))).toBe(false);
  });
});
