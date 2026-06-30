<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="bg-black/90 backdrop-blur border-t border-white/10 flex items-center justify-around h-16 z-50">
    <NuxtLink
      to="/"
      class="flex flex-col items-center gap-1 px-3 py-1"
      :class="isActive('/') ? 'text-primary' : 'text-gray-400'"
    >
      <UIcon name="i-lucide-home" class="w-5 h-5" />
      <span class="text-xs">Trang chủ</span>
    </NuxtLink>

    <NuxtLink
      to="/search"
      class="flex flex-col items-center gap-1 px-3 py-1"
      :class="isActive('/search') ? 'text-primary' : 'text-gray-400'"
    >
      <UIcon name="i-lucide-search" class="w-5 h-5" />
      <span class="text-xs">Tìm kiếm</span>
    </NuxtLink>

    <NuxtLink
      to="/library"
      class="flex flex-col items-center gap-1 px-3 py-1"
      :class="isActive('/library') ? 'text-primary' : 'text-gray-400'"
    >
      <UIcon name="i-lucide-library" class="w-5 h-5" />
      <span class="text-xs">Thư viện</span>
    </NuxtLink>

    <NuxtLink
      v-if="auth.isLoggedIn"
      to="/profile"
      class="flex flex-col items-center gap-1 px-3 py-1"
      :class="isActive('/profile') ? 'text-primary' : 'text-gray-400'"
    >
      <img
        :src="auth.user?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + auth.user?.name"
        class="w-5 h-5 rounded-full object-cover"
      />
      <span class="text-xs">Cá nhân</span>
    </NuxtLink>

    <NuxtLink
      v-else
      to="/login"
      class="flex flex-col items-center gap-1 px-3 py-1 text-gray-400"
    >
      <UIcon name="i-lucide-log-in" class="w-5 h-5" />
      <span class="text-xs">Đăng nhập</span>
    </NuxtLink>
  </nav>
</template>