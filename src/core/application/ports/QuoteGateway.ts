import { Quote } from '../../domain';
import { Result } from '../../domain';

export interface QuoteGateway {
  send(quote: Quote): Promise<Result<void, string>>;
}
