import { useEffect, useState } from 'react'
import api from '../api/axios'
import { usePlayer } from '../context/PlayerContext'

export default function Playlists() {
  const [playlists, setPlaylists] = useState([])
  const [newName, setNewName] = useState('')
  const [selected, setSelected] = useState(null)
  const { playSong } = usePlayer()

  const load = () => {
    api.get('/playlists/').then((res) => setPlaylists(res.data))
  }

  useEffect(() => { load() }, [])

  const createPlaylist = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    await api.post('/playlists/', { name: newName })
    setNewName('')
    load()
  }

  const removeSong = async (playlistId, songId) => {
    await api.post(`/playlists/${playlistId}/remove_song/`, { song_id: songId })
    load()
    if (selected?.id === playlistId) {
      const { data } = await api.get(`/playlists/${playlistId}/`)
      setSelected(data)
    }
  }

  const openPlaylist = async (playlist) => {
    const { data } = await api.get(`/playlists/${playlist.id}/`)
    setSelected(data)
  }

  return (
    <div className="p-4 sm:p-6 pb-32">
      <h1 className="text-2xl font-bold mb-4">Çalma Listelerim</h1>

      <form onSubmit={createPlaylist} className="flex gap-2 mb-6 max-w-md">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Yeni çalma listesi adı..."
          className="flex-1 bg-neutral-800 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        />
        <button className="bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white font-semibold rounded-full px-4 hover:scale-105 transition">
          Oluştur
        </button>
      </form>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Listelerin</h2>
          {playlists.length === 0 && <p className="text-gray-400 text-sm">Henüz çalma listen yok.</p>}
          <div className="flex flex-col gap-1">
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => openPlaylist(pl)}
                className={`text-left px-3 py-2 rounded hover:bg-white/10 transition ${selected?.id === pl.id ? 'bg-white/10' : ''}`}
              >
                <p className="text-sm font-medium">{pl.name}</p>
                <p className="text-xs text-gray-400">{pl.songs.length} şarkı</p>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div>
            <h2 className="text-lg font-semibold mb-2">{selected.name}</h2>
            {selected.songs.length === 0 ? (
              <p className="text-gray-400 text-sm">Bu listede henüz şarkı yok. Ana sayfadan şarkı ekleyebilirsin.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {selected.songs.map((song) => (
                  <div key={song.id} className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/10">
                    <div onClick={() => playSong(song, selected.songs)} className="cursor-pointer min-w-0">
                      <p className="text-sm truncate">{song.title}</p>
                      <p className="text-xs text-gray-400 truncate">{song.artist_name}</p>
                    </div>
                    <button
                      onClick={() => removeSong(selected.id, song.id)}
                      className="text-xs text-gray-400 hover:text-red-400 shrink-0 ml-2"
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
