import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Icon({ children }) {
  return (
    <span className="w-5 h-5 flex items-center justify-center text-lg">
      {children}
    </span>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()

    if (!search.trim()) {
      navigate('/search')
      return
    }

    navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
  className="hidden md:flex fixed left-0 top-0 bottom-0 bg-[#0d0d10] border-r border-white/[0.06] flex-col z-50"
  style={{
    width: '250px',
  }}
>

        {/* LOGO */}
        <div className="px-7 pt-7 pb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-xl">♫</span>
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Vibefy
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                Music for you
              </div>
            </div>
          </Link>
        </div>

        {/* MAIN MENU */}
        <div className="px-4">
          <p className="px-3 mb-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
            Menü
          </p>

          <div className="space-y-1">
            <Link
              to="/"
              className={`sidebar-link ${
                isActive('/') ? 'sidebar-link-active' : ''
              }`}
            >
              <Icon>⌂</Icon>
              <span>Ana Sayfa</span>
            </Link>

            <Link
              to="/search"
              className={`sidebar-link ${
                isActive('/search') ? 'sidebar-link-active' : ''
              }`}
            >
              <Icon>⌕</Icon>
              <span>Keşfet</span>
            </Link>
          </div>
        </div>

        {/* LIBRARY */}
        <div className="px-4 mt-8">
          <div className="flex items-center justify-between px-3 mb-3">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
              Kütüphanen
            </p>
          </div>

          <div className="space-y-1">
            <Link
              to="/favorites"
              className={`sidebar-link ${
                isActive('/favorites') ? 'sidebar-link-active' : ''
              }`}
            >
              <Icon>♡</Icon>
              <span>Beğenilenler</span>
            </Link>

            <Link
              to="/playlists"
              className={`sidebar-link ${
                isActive('/playlists') ? 'sidebar-link-active' : ''
              }`}
            >
              <Icon>▤</Icon>
              <span>Çalma Listelerim</span>
            </Link>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-5 mt-auto mb-5">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Müzik ara..."
                className="w-full h-10 rounded-xl bg-white/[0.05] border border-white/[0.06] pl-9 pr-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition"
              />
            </div>
          </form>
        </div>

        {/* USER */}
        <div className="border-t border-white/[0.06] p-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center font-bold text-sm">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {user.username}
                </p>
                <button
                  onClick={logout}
                  className="text-xs text-zinc-500 hover:text-white transition"
                >
                  Çıkış yap
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="flex-1 text-center text-xs py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1]"
              >
                Giriş
              </Link>

              <Link
                to="/register"
                className="flex-1 text-center text-xs py-2 rounded-lg bg-violet-500 hover:bg-violet-400"
              >
                Kayıt
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d0d10]/95 backdrop-blur-xl border-b border-white/[0.06] z-40 flex items-center justify-between px-5">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
            ♫
          </div>
          <span className="font-bold">Vibefy</span>
        </Link>

        <Link
          to="/search"
          className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-lg"
        >
          ⌕
        </Link>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[#0d0d10]/95 backdrop-blur-xl border-t border-white/[0.06] z-50 flex items-center justify-around">

        <Link
          to="/"
          className={`mobile-nav-item ${
            isActive('/') ? 'text-violet-400' : ''
          }`}
        >
          <span>⌂</span>
          <small>Ana Sayfa</small>
        </Link>

        <Link
          to="/search"
          className={`mobile-nav-item ${
            isActive('/search') ? 'text-violet-400' : ''
          }`}
        >
          <span>⌕</span>
          <small>Keşfet</small>
        </Link>

        <Link
          to="/favorites"
          className={`mobile-nav-item ${
            isActive('/favorites') ? 'text-violet-400' : ''
          }`}
        >
          <span>♡</span>
          <small>Favoriler</small>
        </Link>

        <Link
          to="/playlists"
          className={`mobile-nav-item ${
            isActive('/playlists') ? 'text-violet-400' : ''
          }`}
        >
          <span>▤</span>
          <small>Listeler</small>
        </Link>
      </nav>
    </>
  )
}