<script setup lang="ts">
const { $api } = useNuxtApp()

const { data: songs, refresh } = await useAsyncData<Song[]>(
  'songs',
  () => $api('/songs')
)
</script>

<template>
  <div> 
    <h1 class="text-2xl font-bold mb-6">Mới phát hành</h1>

    <div v-if="!songs?.length" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">🎵</p>
      <p class="font-medium">Chưa có bài hát nào</p>
      <NuxtLink to="/upload">
        <UButton class="mt-4">Tải nhạc lên</UButton>
      </NuxtLink>
    </div>

    <SongList v-else :songs="songs" :refresh="refresh"/>
  </div>
</template>