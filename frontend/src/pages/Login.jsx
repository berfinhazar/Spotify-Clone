import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Kullanıcı adı veya şifre hatalı.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full bg-neutral-800 rounded px-4 py-2 mb-3 outline-none focus:ring-2 focus:ring-violet-500"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-neutral-800 rounded px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold rounded-full py-2 hover:scale-105 transition shadow-lg shadow-violet-500/20">
        Giriş Yap
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Hesabın yok mu? <Link to="/register" className="text-white underline">Kayıt Ol</Link>
        </p>
      </form>
    </div>
  )
}
