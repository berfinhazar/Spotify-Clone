import { useState, useEffect } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Volume2, VolumeX, Volume1 } from 'lucide-react'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'

  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)

  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    seek,
    playNext,
    playPrevious,
    setVolume,
  } = usePlayer()


const { user } = useAuth()
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    setIsFav(Boolean(currentSong?.is_favorited))
  }, [currentSong?.id, currentSong?.is_favorited])

  const toggleFavorite = async () => {
    if (!user || !currentSong) return
    try {
      const { data } = await api.post(`/songs/${currentSong.id}/toggle_favorite/`)
      setIsFav(data.is_favorited)
    } catch (error) {
      console.error('Favori işlemi başarısız:', error)
    }
  }

  if (!currentSong) return null

  return (
    <div className="player-bar-wrapper">
      <div className="player-bar">

        {/* ================= SONG INFO ================= */}
        <div className="player-song">

          <div className="player-cover">
            <span>♫</span>
          </div>

          <div className="player-song-info">
            <p className="player-title">
              {currentSong.title}
            </p>

            <p className="player-artist">
              {currentSong.artist_name}
            </p>
          </div>

          {user && (
            <button
              onClick={toggleFavorite}
              className="player-heart"
              style={{ color: isFav ? '#ec4899' : undefined, opacity: isFav ? 1 : undefined }}
              title={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              {isFav ? '♥' : '♡'}
            </button>
          )}
        </div>


        {/*  CENTER CONTROLS  */}
        <div className="player-center">

          <div className="player-controls">

            <button
              onClick={playPrevious}
              className="player-control secondary"
              title="Önceki"
            >
              ⏮
            </button>

            <button
              onClick={togglePlay}
              className="player-play"
              title={isPlaying ? 'Duraklat' : 'Oynat'}
            >
              {isPlaying ? 'Ⅱ' : '▶'}
            </button>

            <button
              onClick={playNext}
              className="player-control secondary"
              title="Sonraki"
            >
              ⏭
            </button>

          </div>


          {/* PROGRESS */}
          <div className="player-progress">

            <span className="player-time">
              {formatTime(progress)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="player-range"
              style={{
                '--progress':
                  duration > 0
                    ? `${(progress / duration) * 100}%`
                    : '0%',
              }}
            />

            <span className="player-time">
              {formatTime(duration)}
            </span>

          </div>

        </div>


        {/* VOLUME  */}
        <div className="player-volume">

          <span className="volume-icon">
            {volume === 0 ? (
              <VolumeX size={16} />
            ) : volume < 0.5 ? (
              <Volume1 size={16} />
            ) : (
              <Volume2 size={16} />
            )}
          </span>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-range"
            style={{
              '--volume':
                `${volume * 100}%`,
            }}
          />

        </div>

      </div>
    </div>
  )
}