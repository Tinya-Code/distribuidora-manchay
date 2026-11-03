import type { AstroIntegration } from 'astro';
import { injectCoreRoutes } from './injectRoutes';
import { bundlerSettings } from './bundlerSettings';
import { tenantVirtualModule } from './tenantVirtualModule';

export interface CoreIntegrationOptions {
  tenantConfig?: unknown;
}

export function coreIntegration(options: CoreIntegrationOptions = {}): AstroIntegration {
  return {
    name: 'core-integration',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        injectCoreRoutes(injectRoute);
        updateConfig({
          vite: {
            plugins: [tenantVirtualModule(options.tenantConfig ?? {})],
            ...bundlerSettings(),
          },
        });
      },
    },
  };
}

export default coreIntegration;
