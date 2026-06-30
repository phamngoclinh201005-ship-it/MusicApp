<script setup lang="ts">
import type { Song } from '~/composables/usePlayerStore'

const { data: songs } = await useFetch<Song[]>('/api/songs')
const keyword = ref('')

const filtered = computed(() => {
  if (!keyword.value.trim()) return songs.value ?? []
  const kw = keyword.value.toLowerCase()
  return (songs.value ?? []).filter(s =>
    s.title.toLowerCase().includes(kw) || s.artist.toLowerCase().includes(kw)
  )
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Tìm kiếm</h1>

    <UInput
      v-model="keyword"
      placeholder="Tìm bài hát hoặc nghệ sĩ..."
      icon="i-lucide-search"
      size="lg"
      class="mb-6 max-w-md"
    />

    <div v-if="!filtered.length" class="text-center py-16 text-gray-400">
      <p>Không tìm thấy bài hát nào</p>
    </div>

    <SongList v-else :songs="filtered" />
  </div>
</template>