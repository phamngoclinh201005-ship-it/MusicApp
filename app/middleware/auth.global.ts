// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Các trang public — ai cũng xem được, không cần login
  const publicPages = ['/', '/login', '/register', '/search']

  const isPublic = publicPages.some(page =>
    page === '/' ? to.path === '/' : to.path.startsWith(page)
  )

  if (!isPublic && !auth.isLoggedIn) {
    return navigateTo(`/login?redirect=${to.path}`)
  }
})