export { coreIntegration, default } from './integration';
export * from './config';
export * from './content';

// Utility re-exports (minimal public surface)
export type { TenantConfig } from './config/tenantSchema';
export type { FeaturesConfig } from './config/featuresSchema';
export type { ThemeConfig } from './config/themeSchema';
