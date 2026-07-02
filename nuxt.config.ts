// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  nitro: {
    storage: {
      data: { driver: 'fs', base: './data' }
    },
    routeRules: {
      '/api/songs/upload': { 
      }
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,  
    public: {
      apiUrl: process.env.API_URL
    }
  },
})