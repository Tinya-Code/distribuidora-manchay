# Domain Layer

Business rules and domain models. No dependencies on external systems.

## Structure

- Shared types (Money, Result, Identifiers)
- Catalog (Product, Presentation, PriceTier, Category)
- Pricing (PricingStrategy, PricingService)
- Cart (Cart, CartLine, CartPolicy)
- Delivery (DeliveryZone, DeliverySlot)
- Order (Order, OrderBuilder, Customer)
- Quote (Quote, QuoteBuilder)
- Business (Business, BusinessHours)
- Consumption (ConsumptionCalculator)

## Rules

- No imports from Astro, DOM, or browser APIs
- No imports from infrastructure or presentation
- Pure business logic only
