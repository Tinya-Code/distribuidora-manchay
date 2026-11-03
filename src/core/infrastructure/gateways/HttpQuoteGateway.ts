import { Quote } from '../../domain';
import { QuoteGateway } from '../../application';
import { Result, ok, err } from '../../domain';

export class HttpQuoteGateway implements QuoteGateway {
  constructor(private readonly baseUrl: string, private readonly path = '/api/cotizaciones') {}

  async send(quote: Quote): Promise<Result<void, string>> {
    try {
      const res = await fetch(`${this.baseUrl}${this.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
      });
      if (!res.ok) return err(`HTTP ${res.status}`);
      return ok(undefined);
    } catch (e) {
      return err(e instanceof Error ? e.message : 'network error');
    }
  }
}
