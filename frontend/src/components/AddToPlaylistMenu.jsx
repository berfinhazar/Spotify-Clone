import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

/**
 * Şarkı satırında "+" ikonuna tıklanınca açılan küçük dropdown menü.
 * Kullanıcının playlistlerini listeler, tıklayınca şarkıyı o playliste ekler.
 */
export default function AddToPlaylistMenu({ song }) {
  const [open, setOpen] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [addedTo, setAddedTo] = useState(new Set())
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Menü dışına tıklanınca kapansın
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = async (e) => {
    e.stopPropagation()
    if (!open) {
      const { data } = await api.get('/playlists/')
      setPlaylists(data)
    }
    setOpen(!open)
  }

  const handleAdd = async (e, playlistId) => {
    e.stopPropagation()
    await api.post(`/playlists/${playlistId}/add_song/`, { song_id: song.id })
    setAddedTo((prev) => new Set(prev).add(playlistId))
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleOpen}
        title="Çalma listesine ekle"
        className="text-lg opacity-0 group-hover:opacity-100 transition shrink-0 ml-2 text-gray-400 hover:text-white"
      >
        +
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1 w-56 bg-neutral-800 rounded-md shadow-lg z-40 py-1 max-h-64 overflow-y-auto"
        >
          <p className="px-3 py-2 text-xs text-gray-400 border-b border-neutral-700">
            Çalma listesine ekle
          </p>
          {playlists.length === 0 ? (
            <button
              onClick={() => navigate('/playlists')}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-neutral-700"
            >
              Henüz listen yok — oluşturmak için tıkla
            </button>
          ) : (
            playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={(e) => handleAdd(e, pl.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center justify-between"
              >
                <span className="truncate">{pl.name}</span>
                {addedTo.has(pl.id) && <span className="text-green-500 text-xs ml-2 shrink-0">Eklendi ✓</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
