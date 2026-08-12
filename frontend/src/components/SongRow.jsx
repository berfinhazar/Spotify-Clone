import { useEffect, useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function SongRow({ song, songList, onFavoriteToggle }) {
  const { playSong, currentSong, isPlaying } = usePlayer()
  const { user } = useAuth()

  const [isFav, setIsFav] = useState(Boolean(song.is_favorited))
  const [playlists, setPlaylists] = useState([])
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false)
  const [addingTo, setAddingTo] = useState(null)

  const isCurrent = currentSong?.id === song.id

  // Song değiştiğinde favori bilgisini güncelle
  useEffect(() => {
    setIsFav(Boolean(song.is_favorited))
  }, [song.id, song.is_favorited])

  // Kullanıcının playlistlerini getir
  const loadPlaylists = async () => {
    if (!user) return

    try {
      const { data } = await api.get('/playlists/')
      setPlaylists(data)
    } catch (error) {
      console.error('Çalma listeleri alınamadı:', error)
    }
  }

  // Favori ekle / çıkar
  const toggleFavorite = async (e) => {
    e.stopPropagation()

    if (!user) return

    try {
      const { data } = await api.post(
        `/songs/${song.id}/toggle_favorite/`
      )

      setIsFav(data.is_favorited)

      onFavoriteToggle?.(
        song.id,
        data.is_favorited
      )
    } catch (error) {
      console.error('Favori işlemi başarısız:', error)
    }
  }

  // Playlist menüsünü aç
  const togglePlaylistMenu = async (e) => {
    e.stopPropagation()

    if (!user) return

    if (!showPlaylistMenu) {
      await loadPlaylists()
    }

    setShowPlaylistMenu((prev) => !prev)
  }

  // Şarkıyı playlist'e ekle
  const addToPlaylist = async (e, playlistId) => {
    e.stopPropagation()

    try {
      setAddingTo(playlistId)

      await api.post(
        `/playlists/${playlistId}/add_song/`,
        {
          song_id: song.id,
        }
      )

      setShowPlaylistMenu(false)
    } catch (error) {
      console.error(
        'Şarkı çalma listesine eklenemedi:',
        error
      )
    } finally {
      setAddingTo(null)
    }
  }

  return (
    <div
      onClick={() => playSong(song, songList)}
      className={`
        group relative
        flex items-center justify-between
        px-4 py-3
        rounded-xl
        cursor-pointer
        transition-all duration-200

        ${
          isCurrent
            ? 'bg-white/[0.07]'
            : 'hover:bg-white/[0.045]'
        }
      `}
    >

      {/* SOL TARAF */}
      <div className="flex items-center gap-4 min-w-0">

        {/* MÜZİK İKONU */}
        <div
          className={`
            w-11 h-11
            rounded-xl
            shrink-0
            flex items-center justify-center
            bg-gradient-to-br
            from-violet-300
            via-purple-700
            to-indigo-500
            shadow-lg
            ${
              isCurrent
                ? 'shadow-violet-500/20'
                : ''
            }
          `}
        >
          <span className="text-lg text-white">
            ♫
          </span>
        </div>

        {/* ŞARKI BİLGİSİ */}
        <div className="min-w-0">

          <p
            className={`
              text-sm
              font-semibold
              truncate
              ${
                isCurrent
                  ? 'text-pink-400'
                  : 'text-white'
              }
            `}
          >
            {song.title}
          </p>

          <p className="text-xs text-zinc-500 truncate mt-1">
            {song.artist_name}
            {song.album_title
              ? ` • ${song.album_title}`
              : ''}
          </p>

        </div>
      </div>


      {/* SAĞ TARAF */}
      {user && (
        <div
          className="
            flex items-center gap-2
            shrink-0
            ml-4
          "
          onClick={(e) => e.stopPropagation()}
        >

          {/* PLAYLIST BUTONU */}
          <div className="relative">

            <button
              onClick={togglePlaylistMenu}
              className="
                w-9 h-9
                rounded-full
                flex items-center justify-center

                text-zinc-500
                hover:text-white
                hover:bg-white/[0.08]

                transition-all duration-200

                opacity-0
                group-hover:opacity-100
              "
              title="Çalma listesine ekle"
            >
              +
            </button>


            {/* PLAYLIST MENÜSÜ */}
            {showPlaylistMenu && (
              <div
                className="
                  absolute
                  right-0
                  bottom-12

                  w-56
                  p-2

                  rounded-xl

                  bg-[#19171f]
                  border border-white/[0.08]

                  shadow-2xl
                  shadow-black/50

                  z-50
                "
                onClick={(e) => e.stopPropagation()}
              >

                <p className="
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-zinc-400
                ">
                  Çalma listesine ekle
                </p>

                {playlists.length === 0 ? (
                  <p className="
                    px-3
                    py-3
                    text-xs
                    text-zinc-500
                  ">
                    Henüz çalma listen yok.
                  </p>
                ) : (
                  playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={(e) =>
                        addToPlaylist(
                          e,
                          playlist.id
                        )
                      }
                      disabled={
                        addingTo === playlist.id
                      }
                      className="
                        w-full
                        text-left
                        px-3
                        py-2
                        rounded-lg

                        text-sm
                        text-zinc-300

                        hover:bg-white/[0.07]
                        hover:text-white

                        transition
                      "
                    >
                      {addingTo === playlist.id
                        ? 'Ekleniyor...'
                        : playlist.name}
                    </button>
                  ))
                )}

              </div>
            )}

          </div>


          {/* FAVORİ */}
          <button
            onClick={toggleFavorite}
            className={`
              w-9 h-9
              rounded-full

              flex items-center justify-center

              text-xl

              transition-all duration-200

              ${
                isFav
                  ? 'text-pink-500 opacity-100'
                  : 'text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-pink-400'
              }
            `}
            title={
              isFav
                ? 'Favorilerden çıkar'
                : 'Favorilere ekle'
            }
          >
            {isFav ? '♥' : '♡'}
          </button>

        </div>
      )}

    </div>
  )
}