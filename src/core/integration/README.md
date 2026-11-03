# Integration Layer

Astro integration that activates the core in a site.

## Structure

- index.ts - main integration
- injectRoutes.ts - registers core pages as routes
- tenantVirtualModule.ts - delivers tenant config via virtual module
- bundlerSettings.ts - bundler configuration for .astro/.ts files
- routeTable.ts - route mapping

## Rules

- Core pages injected via injectRoute
- Tenant config via virtual module
- Site only uses integration, not internal files
