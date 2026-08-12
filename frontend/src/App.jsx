import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'

import Navbar from './components/Navbar'
import PlayerBar from './components/PlayerBar'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import Playlists from './pages/Playlists'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        Yükleniyor...
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <div className="h-screen overflow-hidden bg-[#09090b] text-white">

      <Navbar />

      {/* ANA İÇERİK */}
      <div className="main-layout">

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/search" element={<Search />} />

            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              }
            />

            <Route
              path="/playlists"
              element={
                <PrivateRoute>
                  <Playlists />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

      </div>

      <PlayerBar />

    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <AppRoutes />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}