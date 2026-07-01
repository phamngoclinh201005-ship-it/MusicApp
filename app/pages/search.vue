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
    <div class="flex items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold whitespace-nowrap">
        Tìm kiếm
      </h1>

      <UInput
        v-model="keyword"
        placeholder="Tìm bài hát hoặc nghệ sĩ..."
        icon="i-lucide-search"
        size="lg"
        class="w-[500px]"
        :ui="{
          base: 'rounded-full'
        }"
      />
    </div>

    <div v-if="!filtered.length" class="text-center py-16 text-gray-400">
      <p>Không tìm thấy bài hát nào</p>
    </div>
    <SongList v-else :songs="filtered" />
  </div>
</template>