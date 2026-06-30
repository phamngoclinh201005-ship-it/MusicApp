<script setup lang="ts">
import type { Song } from '~/composables/usePlayerStore'

const props = defineProps<{ songs: Song[] }>()
const player = usePlayerStore()
const auth = useAuthStore()

const handlePlay = (song: Song) => {
  player.play(song, props.songs)
}

// Trong <script>, currentSong là Ref → PHẢI dùng .value
const isCurrentSong = (song: Song) => {
  return player.currentSong.value?.id === song.id
}

const showMenu = ref<number | null>(null)
const playlists = ref<any[]>([])

const loadPlaylists = async () => {
  if (!auth.isLoggedIn) return
  const { $api } = useNuxtApp()
  playlists.value = await ($api as any)('/playlists')
}

const addToPlaylist = async (songId: number, playlistId: number) => {
  const { $api } = useNuxtApp()
  await ($api as any)(`/playlists/${playlistId}/songs`, {
    method: 'POST',
    body: { songId }
  })
  showMenu.value = null
}

const toggleMenu = async (songId: number) => {
  if (showMenu.value === songId) {
    showMenu.value = null
  } else {
    await loadPlaylists()
    showMenu.value = songId
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="(song, index) in songs"
      :key="song.id"
      class="flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-800 group relative"
      :class="{ 'bg-gray-800': isCurrentSong(song) }"
    >
      <div class="w-6 text-center shrink-0 cursor-pointer" @click="handlePlay(song)">
        <span v-if="!isCurrentSong(song)" class="text-gray-400 text-sm group-hover:hidden">
          {{ index + 1 }}
        </span>
        <UIcon v-if="!isCurrentSong(song)" name="i-lucide-play" class="w-4 h-4 text-white hidden group-hover:block" />
        <UIcon v-else name="i-lucide-volume-2" class="w-4 h-4 text-primary" />
      </div>

      <img :src="song.coverUrl" class="w-10 h-10 rounded object-cover shrink-0 cursor-pointer" @click="handlePlay(song)" />

      <div class="flex-1 overflow-hidden cursor-pointer" @click="handlePlay(song)">
        <p class="text-sm font-medium truncate" :class="isCurrentSong(song) ? 'text-primary' : 'text-white'">
          {{ song.title }}
        </p>
        <p class="text-xs text-gray-400 truncate">{{ song.artist }}</p>
      </div>

      <button
        v-if="auth.isLoggedIn"
        class="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 shrink-0"
        @click="toggleMenu(song.id)"
      >
        <UIcon name="i-lucide-plus" class="w-5 h-5" />
      </button>

      <div
        v-if="showMenu === song.id"
        class="absolute right-0 top-10 bg-gray-800 rounded shadow-lg p-2 z-10 w-48"
      >
        <p v-if="!playlists.length" class="text-xs text-gray-400 p-2">Chưa có playlist nào</p>
        <button
          v-for="p in playlists"
          :key="p.id"
          class="block w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-700"
          @click="addToPlaylist(song.id, p.id)"
        >
          {{ p.name }}
        </button>
      </div>
    </div>
  </div>
</template>