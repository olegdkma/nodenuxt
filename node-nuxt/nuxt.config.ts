// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Runtime config for API
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-api.com' 
        : 'http://localhost:3002'
    }
  },

  // Enable server-side rendering
  ssr: true,

  // Dev server configuration
  devServer: {
    port: 3010
  },

  // Add nitro configuration for API proxy (optional)
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3002/api',
        changeOrigin: true
      }
    }
  }
})
