import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/auth.css'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/dashboard')
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-wrapper">
      <div>
        <div className="auth-logo"><h1>Lab<span>Hub</span></h1></div>
        <div className="auth-box">
          <h2>Sign in to your account</h2>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Email address</label>
            <input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password"
              value={form.password} onChange={handleChange} />
          </div>
          <button className="auth-btn" onClick={submit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <hr className="divider" />
          <div className="auth-footer">
            New to LabHub? <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}