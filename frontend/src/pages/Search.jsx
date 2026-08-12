import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import SongRow from '../components/SongRow'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setSongs([])
      return
    }
    setLoading(true)
    api.get(`/songs/?search=${encodeURIComponent(query)}`)
      .then((res) => setSongs(res.data))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="p-4 sm:p-6 pb-32">
      <h1 className="text-2xl font-bold mb-4">"{query}" için sonuçlar</h1>
      {loading && <p className="text-gray-400">Aranıyor...</p>}
      {!loading && songs.length === 0 && query && (
        <p className="text-gray-400">Sonuç bulunamadı.</p>
      )}
      <div className="flex flex-col gap-1">
        {songs.map((song) => (
          <SongRow key={song.id} song={song} songList={songs} />
        ))}
      </div>
    </div>
  )
}
