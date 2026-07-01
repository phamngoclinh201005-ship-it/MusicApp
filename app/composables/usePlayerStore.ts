export interface Song {
  id: number
  title: string
  artist: string
  coverUrl: string
  audioUrl: string
  duration: number
  likes: number
  liked?: boolean
  likedUsers?: number[]
  uploadedBy?: number
  uploadedAt?: string
}

export const usePlayerStore = () => {
  const currentSong = useState<Song | null>('player_current_song', () => null)
  const queue = useState<Song[]>('player_queue', () => [])
  const originalQueue = useState<Song[]>('player_original_queue', () => [])
  const isPlaying = useState<boolean>('player_is_playing', () => false)
  const currentTime = useState<number>('player_current_time', () => 0)
  const duration = useState<number>('player_duration', () => 0)
  const volume = useState<number>('player_volume', () => 0.8)
  const isShuffle = useState<boolean>('player_shuffle', () => false)
  const repeatMode = useState<'off' | 'all' | 'one'>('player_repeat', () => 'off')

  const audio = useState<HTMLAudioElement | null>('player_audio_el', () => null)

  const ensureAudio = () => {
    if (!audio.value && typeof window !== 'undefined') {
      audio.value = new Audio()
      audio.value.volume = volume.value

      audio.value.addEventListener('timeupdate', () => {
        currentTime.value = audio.value?.currentTime ?? 0
      })
      audio.value.addEventListener('loadedmetadata', () => {
        duration.value = audio.value?.duration ?? 0
      })
      audio.value.addEventListener('ended', () => {
        handleSongEnd()
      })
    }
  }

  const handleSongEnd = () => {
    if (repeatMode.value === 'one') {
      if (audio.value) {
        audio.value.currentTime = 0
        audio.value.play()
      }
      return
    }
    playNext()
  }

  const shuffleArray = (arr: Song[]) => {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = result[i]!
      result[i] = result[j]!
      result[j] = temp
    }


    return result
  }

  const play = (song: Song, songQueue?: Song[]) => {
    ensureAudio()
    if (!audio.value) return

    currentSong.value = song

    if (songQueue) {
      originalQueue.value = songQueue
      queue.value = isShuffle.value ? shuffleArray(songQueue) : songQueue
    }

    audio.value.src = song.audioUrl
    audio.value.play()
    isPlaying.value = true
  }

  const togglePlay = () => {
    if (!audio.value) return
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
    isPlaying.value = !isPlaying.value
  }

  const playNext = () => {
    if (!currentSong.value || queue.value.length === 0) return
    const idx = queue.value.findIndex(s => s.id === currentSong.value?.id)
    let next = queue.value[idx + 1]

    if (!next && repeatMode.value === 'all') {
      next = queue.value[0]
    }

    if (next) play(next, undefined)
    else {
      isPlaying.value = false
    }
  }

  const playPrev = () => {
    if (!currentSong.value || queue.value.length === 0) return
    const idx = queue.value.findIndex(s => s.id === currentSong.value?.id)
    const prev = queue.value[idx - 1]
    if (prev) play(prev, undefined)
  }

  const toggleShuffle = () => {
    isShuffle.value = !isShuffle.value

    if (isShuffle.value) {
      queue.value = shuffleArray(originalQueue.value)
    } else {
      queue.value = originalQueue.value
    }
  }

  const toggleRepeat = () => {
    if (repeatMode.value === 'off') repeatMode.value = 'all'
    else if (repeatMode.value === 'all') repeatMode.value = 'one'
    else repeatMode.value = 'off'
  }

  const seek = (time: number) => {
    if (!audio.value) return
    audio.value.currentTime = time
  }

  const setVolume = (v: number) => {
    volume.value = v
    if (audio.value) audio.value.volume = v
  }

  return {
    currentSong, queue, isPlaying, currentTime, duration, volume,
    isShuffle, repeatMode,
    play, togglePlay, playNext, playPrev, seek, setVolume,
    toggleShuffle, toggleRepeat
  }
}