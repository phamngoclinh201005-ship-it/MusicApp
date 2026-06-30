export interface Song {
  id: number
  title: string
  artist: string
  coverUrl: string
  audioUrl: string
  duration: number
}

export const usePlayerStore = () => {
  const currentSong = useState<Song | null>('player_current_song', () => null)
  const queue = useState<Song[]>('player_queue', () => [])
  const isPlaying = useState<boolean>('player_is_playing', () => false)
  const currentTime = useState<number>('player_current_time', () => 0)
  const duration = useState<number>('player_duration', () => 0)
  const volume = useState<number>('player_volume', () => 0.8)
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
        playNext()
      })
    }
  }

  const play = (song: Song, songQueue?: Song[]) => {
    ensureAudio()
    if (!audio.value) return

    currentSong.value = song
    if (songQueue) queue.value = songQueue

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
    const next = queue.value[idx + 1]
    if (next) play(next, queue.value)
  }

  const playPrev = () => {
    if (!currentSong.value || queue.value.length === 0) return
    const idx = queue.value.findIndex(s => s.id === currentSong.value?.id)
    const prev = queue.value[idx - 1]
    if (prev) play(prev, queue.value)
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
    play, togglePlay, playNext, playPrev, seek, setVolume
  }
}