const VIRTUAL_ID = 'virtual:tenant-config';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export function tenantVirtualModule(config: unknown): any {
  return {
    name: 'tenant-virtual-module',
    resolveId(id: any) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id: any) {
      if (id === RESOLVED_ID) {
        return `export default ${JSON.stringify(config)};`;
      }
      return null;
    },
  };
}
