export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  const publicPages = ['/', '/login', '/register']

  const isPublic = publicPages.some(page =>
    page === '/' ? to.path === '/' : to.path.startsWith(page)
  )

  if (!isPublic && !auth.isLoggedIn) {
    return navigateTo(`/login?redirect=${to.path}`)
  }
})