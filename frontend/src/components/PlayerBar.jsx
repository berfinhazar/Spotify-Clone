import { usePlayer } from '../context/PlayerContext'

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

          <button className="player-heart">
            ♡
          </button>
        </div>


        {/* ================= CENTER CONTROLS ================= */}
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


        {/* ================= VOLUME ================= */}
        <div className="player-volume">

          <span className="volume-icon">
            {volume === 0 ? '×' : '◖'}
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