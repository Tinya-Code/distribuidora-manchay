# Infrastructure Layer

Adapters that implement the application ports. Depends on application and domain.

## Structure

- Storage (LocalStorage, Memory)
- Gateways (HTTP, Beacon, Null)
- Messaging (WhatsApp, Template)
- Catalog (StaticCatalogSource)
- Analytics (Plausible, GA4, Noop)
- Time (SystemClock)
- IDs (RandomCodeGenerator)

## Rules

- Implements application ports
- No business logic
- Wraps external systems
