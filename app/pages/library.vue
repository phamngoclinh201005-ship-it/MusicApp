<script setup lang="ts">
interface Playlist {
  id: number
  name: string
  songs: any[]
}

const { $api } = useNuxtApp()
const api = $api as any

const { data: playlists, refresh } = await useAsyncData<Playlist[]>('my-playlists', () =>
  api('/playlists')
)

const newPlaylistName = ref('')
const creating = ref(false)
const showCreateForm = ref(false)

const handleCreate = async () => {
  if (!newPlaylistName.value.trim()) return

  try {
    creating.value = true
    await api('/playlists', {
      method: 'POST',
      body: { name: newPlaylistName.value }
    })
    newPlaylistName.value = ''
    showCreateForm.value = false
    await refresh()
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Thư viện của tôi</h1>
      <UButton @click="showCreateForm = !showCreateForm">+ Tạo playlist</UButton>
    </div>

    <!-- Form tạo playlist -->
    <UCard v-if="showCreateForm" class="mb-6 max-w-sm">
      <div class="flex gap-2">
        <UInput v-model="newPlaylistName" placeholder="Tên playlist" />
        <UButton :loading="creating" @click="handleCreate">Tạo</UButton>
      </div>
    </UCard>

    <!-- Danh sách playlist -->
    <div v-if="!playlists?.length" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">📁</p>
      <p>Bạn chưa có playlist nào</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <NuxtLink
        v-for="playlist in playlists"
        :key="playlist.id"
        :to="`/playlists/${playlist.id}`"
      >
        <UCard class="hover:bg-gray-800 transition-colors cursor-pointer">
          <div class="aspect-square bg-gray-700 rounded mb-3 flex items-center justify-center">
            <UIcon name="i-lucide-music" class="w-10 h-10 text-gray-400" />
          </div>
          <p class="font-medium truncate">{{ playlist.name }}</p>
          <p class="text-xs text-gray-400">{{ playlist.songs.length }} bài hát</p>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>