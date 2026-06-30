<script setup lang="ts">
const player = usePlayerStore()
const { currentSong, isPlaying, currentTime, duration, volume } = player

const formatTime = (sec: number) => {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const handleSeek = (e: MouseEvent) => {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  player.seek(percent * duration.value)
}

const localVolume = ref(volume.value)

watch(volume, (v) => {
  localVolume.value = v
})

const handleVolumeInput = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  localVolume.value = value
  player.setVolume(value)
}
</script>

<template>
  <div
    v-if="currentSong"
    class="h-20 bg-black/40 border-t border-white/5 flex items-center px-3 md:px-4 gap-2 md:gap-4"
  >
    <!-- Thông tin bài hát -->
    <div class="flex items-center gap-2 md:gap-3 w-32 md:w-64 shrink-0">
      <img :src="currentSong.coverUrl" class="w-10 h-10 md:w-12 md:h-12 rounded object-cover" />
      <div class="overflow-hidden hidden sm:block">
        <p class="text-sm font-medium text-white truncate">{{ currentSong.title }}</p>
        <p class="text-xs text-gray-400 truncate">{{ currentSong.artist }}</p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex-1 flex flex-col items-center gap-2 max-w-xl mx-auto">
      <div class="flex items-center gap-3 md:gap-4">
        <button class="text-gray-400 hover:text-white hidden sm:block" @click="player.playPrev">
          <UIcon name="i-lucide-skip-back" class="w-5 h-5" />
        </button>
        <button class="bg-white text-black rounded-full p-2 hover:scale-105" @click="player.togglePlay">
          <UIcon :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'" class="w-5 h-5" />
        </button>
        <button class="text-gray-400 hover:text-white hidden sm:block" @click="player.playNext">
          <UIcon name="i-lucide-skip-forward" class="w-5 h-5" />
        </button>
      </div>

      <!-- Progress bar - ẩn trên mobile rất nhỏ -->
      <div class="hidden sm:flex items-center gap-2 w-full text-xs text-gray-400">
        <span>{{ formatTime(currentTime) }}</span>
        <div class="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative" @click="handleSeek">
          <div class="h-1 bg-white rounded-full" :style="{ width: progressPercent + '%' }" />
        </div>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- Volume - ẩn hẳn trên mobile -->
    <div class="hidden md:flex w-32 items-center gap-2 shrink-0">
      <UIcon name="i-lucide-volume-2" class="w-4 h-4 text-gray-400" />
      <input
        type="range" min="0" max="1" step="0.01"
        :value="localVolume"
        class="w-full accent-primary"
        @input="handleVolumeInput"
      />
    </div>
  </div>
</template>