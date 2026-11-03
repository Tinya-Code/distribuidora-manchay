# Application Layer

Use cases and contracts (ports). Depends on domain only.

## Structure

- Ports (contracts for external dependencies)
- Use cases (AddToCart, SubmitOrder, etc.)
- Queries (CatalogQuery, RelatedProducts)
- DTOs (data transfer objects)

## Rules

- Depends only on domain
- Defines contracts via ports
- No infrastructure implementation
