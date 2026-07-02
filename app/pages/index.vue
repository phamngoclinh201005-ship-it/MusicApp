<script setup lang="ts">
import type { Song } from '~/composables/usePlayerStore'

const { $api } = useNuxtApp()
const api = $api as any

const { data: songs } = await useAsyncData<(Song & { likes: number; liked: boolean })[]>(
  'songs',
  () => api('/songs')
)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Mới phát hành</h1>

  
      <NuxtLink to="/search" class="hidden sm:flex flex-1 max-w-xl mx-8">
        <UInput
          placeholder="Tìm bài hát hoặc nghệ sĩ..."
          icon="i-lucide-search"
          class="w-full cursor-pointer"
          readonly
        />
      </NuxtLink>

      
      <NuxtLink to="/search" class="sm:hidden">
        <UButton variant="ghost" size="sm">
          <UIcon name="i-lucide-search" class="w-5 h-5" />
        </UButton>
      </NuxtLink>
    </div>

    <div v-if="!songs?.length" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">🎵</p>
      <p class="font-medium">Chưa có bài hát nào</p>
      <NuxtLink to="/upload">
        <UButton class="mt-4">Tải nhạc lên</UButton>
      </NuxtLink>
    </div>

    <SongList v-else :songs="songs" />
  </div>
</template>