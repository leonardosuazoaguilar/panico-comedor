import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cliente from './client.json' with { type: 'json' };

export default defineConfig({
  site: cliente.site,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
});
