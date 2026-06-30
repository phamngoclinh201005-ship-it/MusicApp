export const useAuthStore = defineStore('auth', () => {
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax' as const
  })

  const user = ref<{
    id: number
    name: string
    email: string
    avatarUrl?: string | null
  } | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const route = useRoute()

    const res = await $fetch<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })

    token.value = res.token
    user.value = res.user

    // Lấy thêm avatar nếu có
    const { $api } = useNuxtApp()
    try {
      const fullUser = await ($api as any)('/users/me')
      user.value = fullUser
    } catch {}

    const redirectTo = (route.query.redirect as string) || '/'
    await navigateTo(redirectTo)
  }

  const register = async (name: string, email: string, password: string) => {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password }
    })
    await login(email, password)
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  const refreshUser = async () => {
    const { $api } = useNuxtApp()
    const fullUser = await ($api as any)('/users/me')
    user.value = fullUser
  }

  return { token, user, isLoggedIn, login, register, logout, refreshUser }
})