// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://aguaspachacamac.pe',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@core': path.resolve(__dirname, './src/core'),
        '@tenant': path.resolve(__dirname, './src/tenant'),
      },
    },
  },
});
