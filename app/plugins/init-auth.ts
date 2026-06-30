export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  if (auth.isLoggedIn && !auth.user) {
    try {
      await auth.refreshUser()
    } catch {
      auth.logout()
    }
  }
})