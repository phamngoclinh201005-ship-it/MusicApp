<script setup lang="ts">
const route = useRoute()
const { $api } = useNuxtApp()
const api = $api as any

interface Playlist {
  id: number
  name: string
  songs: any[]
}

const { data: playlists } = await useAsyncData<Playlist[]>('playlist-detail', () =>
  api('/playlists')
)

const playlist = computed(() =>
  playlists.value?.find(p => p.id === Number(route.params.id))
)
</script>

<template>
  <div v-if="playlist">
    <div class="flex items-end gap-4 mb-6">
      <div class="w-40 h-40 bg-gray-700 rounded flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-music" class="w-16 h-16 text-gray-400" />
      </div>
      <div>
        <p class="text-sm text-gray-400">Playlist</p>
        <h1 class="text-3xl font-bold">{{ playlist.name }}</h1>
        <p class="text-sm text-gray-400 mt-1">{{ playlist.songs.length }} bài hát</p>
      </div>
    </div>

    <SongList v-if="playlist.songs.length" :songs="playlist.songs" />
    <p v-else class="text-gray-400 text-center py-16">Playlist này chưa có bài hát nào</p>
  </div>
</template>