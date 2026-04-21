import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import alpinejs from '@astrojs/alpinejs';
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  adapter: vercel(),
  integrations: [alpinejs({ entrypoint: '/src/alpine/index.js' })],
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
  site: 'https://www.mibiblia365.com',
});
