import { useEffect, useState } from 'react'
import api from '../api/axios'
import SongRow from '../components/SongRow'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/favorites/')
      .then((res) => setFavorites(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFavoriteToggle = (songId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((f) => f.song !== songId))
    }
  }

  const songList = favorites.map((f) => ({ ...f.song_detail, is_favorited: true }))

  return (
    <div className="p-4 sm:p-6 pb-32">
      <h1 className="text-2xl font-bold mb-4">♥ Beğenilen Şarkılar</h1>
      {loading && <p className="text-gray-400">Yükleniyor...</p>}
      {!loading && favorites.length === 0 && (
        <p className="text-gray-400">Henüz favori şarkın yok. Şarkıların yanındaki kalp ikonuna tıklayarak ekleyebilirsin.</p>
      )}
      <div className="flex flex-col gap-1">
        {songList.map((song) => (
          <SongRow key={song.id} song={song} songList={songList} onFavoriteToggle={handleFavoriteToggle} />
        ))}
      </div>
    </div>
  )
}
