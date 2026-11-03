# Composition Layer

Assembles the system from configuration. Depends on all layers.

## Structure

- buildContainer.ts - creates all pieces from tenant config
- containerContext.ts - how controllers get the container
- Store.ts - base class for reactive state
- CartStore.ts - cart state wrapper
- PricingModeStore.ts - pricing mode state

## Rules

- Single instance per page
- Shared state between islands
- Persists via browser storage
