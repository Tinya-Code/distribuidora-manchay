import { MessageChannel } from '../../application';

export class WhatsAppMessageChannel implements MessageChannel {
  constructor(private readonly phone: string) {}

  buildLink(message: string): string {
    const cleaned = this.phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  }
}
