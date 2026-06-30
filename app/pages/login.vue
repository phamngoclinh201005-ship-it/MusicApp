<script setup lang="ts">
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

if (auth.isLoggedIn) {
  await navigateTo('/')
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    await auth.login(email.value, password.value)
  } catch (e: any) {
    error.value = e.data?.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold">🎵 Đăng nhập</h1>
      </template>

      <div class="flex flex-col gap-4">
        <UInput v-model="email" placeholder="Email" type="email" />
        <UInput v-model="password" placeholder="Mật khẩu" type="password" />
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <UButton block :loading="loading" @click="handleLogin">Đăng nhập</UButton>
      </div>

      <template #footer>
        <p class="text-sm text-center">
          Chưa có tài khoản?
          <NuxtLink to="/register" class="text-primary">Đăng ký</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>