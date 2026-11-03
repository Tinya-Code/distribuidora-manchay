import { WhatsAppMessageChannel } from '@core/infrastructure';

describe('WhatsAppMessageChannel', () => {
  it('builds wa.me link', () => {
    const ch = new WhatsAppMessageChannel('+51 999 111 222');
    const link = ch.buildLink('hola');
    expect(link).toContain('wa.me/51999111222');
    expect(link).toContain('text=hola');
  });
});
