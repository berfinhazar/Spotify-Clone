import { createContext, useContext, useState, useRef, useEffect } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [queue, setQueue] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef(new Audio())

  useEffect(() => {
    const audio = audioRef.current
    const updateProgress = () => setProgress(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    const handleEnded = () => playNext()

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentSong])

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  const playSong = (song, songList = []) => {
    setCurrentSong(song)
    setQueue(songList.length ? songList : [song])
    audioRef.current.src = song.audio_file
    audioRef.current.play()
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!currentSong) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seek = (time) => {
    audioRef.current.currentTime = time
    setProgress(time)
  }

  const playNext = () => {
    if (!currentSong || queue.length === 0) return
    const idx = queue.findIndex((s) => s.id === currentSong.id)
    const next = queue[idx + 1]
    if (next) playSong(next, queue)
  }

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return
    const idx = queue.findIndex((s) => s.id === currentSong.id)
    const prev = queue[idx - 1]
    if (prev) playSong(prev, queue)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong, isPlaying, progress, duration, volume,
        playSong, togglePlay, seek, playNext, playPrevious, setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
