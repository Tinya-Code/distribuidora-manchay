export interface TenantConfig {
  identity: { name: string; slogan?: string };
  contact: { phone: string; whatsapp: string; email?: string; address: string };
  hours: { open: string; close: string; days: number[]; cutoff?: string };
  payments: { methods: string[] };
  api: { baseUrl?: string; enabled: boolean };
  features: Record<string, boolean>;
  analytics: { provider?: 'none' | 'plausible' | 'ga4'; domain?: string };
  seo: { title: string; description: string };
}

export function validateTenantConfig(config: unknown): TenantConfig {
  if (!config || typeof config !== 'object') throw new Error('tenant config must be an object');
  const c = config as any;
  if (!c.identity?.name) throw new Error('tenant config: identity.name is required');
  if (!c.contact?.phone) throw new Error('tenant config: contact.phone is required');
  if (!c.contact?.whatsapp) throw new Error('tenant config: contact.whatsapp is required');
  if (!c.contact?.address) throw new Error('tenant config: contact.address is required');
  if (!c.hours?.open || !c.hours?.close) throw new Error('tenant config: hours.open/close required');
  if (!Array.isArray(c.hours?.days)) throw new Error('tenant config: hours.days must be array');
  if (!c.seo?.title) throw new Error('tenant config: seo.title is required');
  return c as TenantConfig;
}
