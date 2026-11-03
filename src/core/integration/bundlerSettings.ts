export function bundlerSettings(): any {
  return {
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.astro'],
    },
  };
}
