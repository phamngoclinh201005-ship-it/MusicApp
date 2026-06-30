<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <aside class="w-60 bg-black/30 h-full flex flex-col p-4 shrink-0 border-r border-white/5">
    <NuxtLink to="/" class="text-2xl font-bold mb-8 text-white">
      🎵 MusicApp
    </NuxtLink>

    <nav class="flex flex-col gap-1">
      <NuxtLink to="/"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800">
        <UIcon name="i-lucide-home" class="w-5 h-5" />
        Trang chủ
      </NuxtLink>
      <NuxtLink to="/search"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800">
        <UIcon name="i-lucide-search" class="w-5 h-5" />
        Tìm kiếm
      </NuxtLink>
      <NuxtLink to="/library"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800">
        <UIcon name="i-lucide-library" class="w-5 h-5" />
        Thư viện
      </NuxtLink>
      <NuxtLink v-if="auth.isLoggedIn" to="/upload"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800">
        <UIcon name="i-lucide-upload" class="w-5 h-5" />
        Tải nhạc lên
      </NuxtLink>
    </nav>
    <div class="mt-auto">
      <template v-if="auth.isLoggedIn">
        <NuxtLink to="/profile" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
          <img :src="auth.user?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + auth.user?.name"
            class="w-8 h-8 rounded-full object-cover" />
          <p class="text-sm text-gray-300 truncate">{{ auth.user?.name }}</p>
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink to="/login">
          <UButton block>Đăng nhập</UButton>
        </NuxtLink>
      </template>
    </div>
  </aside>
</template>