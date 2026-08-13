import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form.username, form.email, form.password, form.password2)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      const firstError = data ? Object.values(data)[0] : null
      setError(Array.isArray(firstError) ? firstError[0] : 'Kayıt sırasında bir hata oluştu.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          name="username" type="text" placeholder="Kullanıcı adı" value={form.username}
          onChange={handleChange} required
          className="w-full bg-neutral-800 rounded px-4 py-2 mb-3 outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        />
        <input
          name="email" type="email" placeholder="E-posta" value={form.email}
          onChange={handleChange}
          className="w-full bg-neutral-800 rounded px-4 py-2 mb-3 outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        />
        <input
          name="password" type="password" placeholder="Şifre" value={form.password}
          onChange={handleChange} required
          className="w-full bg-neutral-800 rounded px-4 py-2 mb-3 outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        />
        <input
          name="password2" type="password" placeholder="Şifre (tekrar)" value={form.password2}
          onChange={handleChange} required
          className="w-full bg-neutral-800 rounded px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        />
        <button className="w-full bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white font-semibold rounded-full py-2 hover:scale-105 transition">
          Kayıt Ol
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Zaten hesabın var mı? <Link to="/login" className="text-white underline">Giriş Yap</Link>
        </p>
      </form>
    </div>
  )
}
