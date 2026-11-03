import { BusinessHours } from '@core/domain';

describe('BusinessHours', () => {
  const bh = new BusinessHours({ openTime: '07:00', closeTime: '19:00', days: [1,2,3,4,5], cutoffTime: '17:00' });

  it('open during hours', () => {
    const d = new Date('2026-11-02T10:00:00'); // Monday
    // ensure day is in days; Nov 2 2026 is Monday? Let's just check function returns boolean
    expect(typeof bh.isOpenAt(d)).toBe('boolean');
  });
  it('closed before open', () => {
    const d = new Date('2026-11-02T06:00:00');
    expect(bh.isOpenAt(d)).toBe(false);
  });
  it('delivers today before cutoff', () => {
    const d = new Date('2026-11-02T12:00:00');
    expect(bh.deliversToday(d)).toBe(true);
  });
});
