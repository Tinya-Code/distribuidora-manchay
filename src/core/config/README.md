# Config Layer

Schemas for validating tenant configuration and content.

## Structure

- tenantSchema.ts - validates tenant.config.ts
- featuresSchema.ts - validates enabled features
- themeSchema.ts - validates theme variables
- contentSchemas/ - schemas for each content collection

## Rules

- All tenant data validated at build time
- Missing or malformed data fails build with clear message
- Contract between general (core) and specific (tenant)
