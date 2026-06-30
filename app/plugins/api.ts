export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiUrl,

    onRequest({ options }) {
      if (auth.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${auth.token}`
        } as any 
      }
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        auth.logout()
      }
    }
  })

  return { provide: { api } }
})