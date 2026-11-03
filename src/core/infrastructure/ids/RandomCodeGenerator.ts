import { CodeGenerator } from '../../application';
import { OrderCode as DomainOrderCode, QuoteCode as DomainQuoteCode } from '../../domain';

export class RandomCodeGenerator implements CodeGenerator {
  private random4(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  private datePart(now: Date): string {
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yy}${mm}${dd}`;
  }

  generateOrderCode(now: Date): DomainOrderCode {
    return new DomainOrderCode(`PED-${this.datePart(now)}-${this.random4()}`);
  }

  generateQuoteCode(now: Date): DomainQuoteCode {
    return new DomainQuoteCode(`COT-${this.datePart(now)}-${this.random4()}`);
  }
}
