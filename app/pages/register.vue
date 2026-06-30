<script setup lang="ts">
const auth = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    await auth.register(name.value, email.value, password.value)
  } catch (e: any) {
    error.value = e.data?.message || 'Đăng ký thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold">🎵 Đăng ký</h1>
      </template>

      <div class="flex flex-col gap-4">
        <UInput v-model="name" placeholder="Họ tên" />
        <UInput v-model="email" placeholder="Email" type="email" />
        <UInput v-model="password" placeholder="Mật khẩu" type="password" />
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <UButton block :loading="loading" @click="handleRegister">Đăng ký</UButton>
      </div>

      <template #footer>
        <p class="text-sm text-center">
          Đã có tài khoản?
          <NuxtLink to="/login" class="text-primary">Đăng nhập</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>