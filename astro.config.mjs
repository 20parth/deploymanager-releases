import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://deploymanager.parthrb.dev',
  integrations: [tailwind()],
  vite: {
    ssr: {
      noExternal: ['three'],
    },
    optimizeDeps: {
      exclude: ['lenis'],
    },
    build: {
      chunkSizeWarningLimit: 650,
    },
  },
});
