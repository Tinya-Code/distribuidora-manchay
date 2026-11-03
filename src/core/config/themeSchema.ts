export interface ThemeConfig {
  colors: Record<string, string>;
  fonts: { sans: string };
  radii: Record<string, string>;
}

export function validateThemeConfig(config: unknown): ThemeConfig {
  if (!config || typeof config !== 'object') throw new Error('theme config must be an object');
  const c = config as any;
  if (!c.colors || typeof c.colors !== 'object') throw new Error('theme.colors is required');
  if (!c.fonts?.sans) throw new Error('theme.fonts.sans is required');
  return c as ThemeConfig;
}
