<script setup lang="ts">
const title = ref('')
const artist = ref('')
const audioFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleAudioChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  audioFile.value = target.files?.[0] ?? null
}

const handleCoverChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  coverFile.value = target.files?.[0] ?? null
}

const handleUpload = async () => {
  if (!title.value || !artist.value || !audioFile.value) {
    error.value = 'Vui lòng điền đủ thông tin và chọn file nhạc'
    return
  }

  try {
    loading.value = true
    error.value = ''

    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('artist', artist.value)
    formData.append('audio', audioFile.value)
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    const { $api } = useNuxtApp()
    const api = $api as any

    await api('/songs/upload', {
      method: 'POST',
      body: formData
    })

    success.value = true
    title.value = ''
    artist.value = ''
    audioFile.value = null
    coverFile.value = null
  } catch (e: any) {
    error.value = e.data?.message || 'Upload thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-6">Tải nhạc lên</h1>

    <UCard>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 text-green-500">Tên bài hát</label>
          <UInput v-model="title" placeholder="Nhập tên bài hát" class="w-full"/>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-green-500">Ca sĩ / Nghệ sĩ</label>
          <UInput v-model="artist" placeholder="Nhập tên nghệ sĩ" class="w-full"/>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-green-500">File nhạc (mp3)</label>
          <label
            class="flex items-center justify-center gap-2 border border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-gray-800 transition-colors">
            <UIcon name="i-lucide-upload" class="w-5 h-5 text-gray-400" />
            <span class="text-sm text-gray-400">
              {{ audioFile ? audioFile.name : 'Chọn file mp3' }}
            </span>
            <input type="file" accept="audio/mp3,audio/mpeg" class="hidden" @change="handleAudioChange" />
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-green-500">Ảnh bìa (tùy chọn)</label>
          <label
            class="flex items-center justify-center gap-2 border border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-gray-800 transition-colors">
            <UIcon name="i-lucide-image" class="w-5 h-5 text-gray-400" />
            <span class="text-sm text-gray-400">
              {{ coverFile ? coverFile.name : 'Chọn ảnh bìa' }}
            </span>
            <input type="file" accept="image/*" class="hidden" @change="handleCoverChange" />
          </label>
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-sm">Upload thành công!</p>

        <UButton block :loading="loading" @click="handleUpload">
          Tải lên
        </UButton>
      </div>
    </UCard>
  </div>
</template>