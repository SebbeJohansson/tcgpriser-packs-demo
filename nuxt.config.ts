import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    preset: 'netlify',
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
    },
  },
  runtimeConfig: {
    // A service token from the API's `API_AUTH_TOKENS`, sent as `Authorization: Bearer` on every
    // request to api.tcgpriser.se. Identifies this app's server (build-time prerender and the
    // deployed Netlify function) as internal infrastructure rather than anonymous/bot traffic.
    // Needed at build time too, since prerendering happens during `yarn build`. Server-only: never
    // move this under `public`, that would ship it to every visitor.
    apiServiceToken: process.env.PRERENDER_API_AUTH_TOKEN,
  },
  app: {
    head: {
      title: 'Packs',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
})
