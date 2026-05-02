import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/auth.css'

export default function Signup() {
  const [form, setForm]       = useState({ username:'', email:'', password:'', confirm:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.username || !form.email || !form.password) { setError('Please fill in all fields'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: form.username, email: form.email, password: form.password,
      })
      nav('/')
    } catch (e) {
      setError(e.response?.data?.error || 'Signup failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-wrapper">
      <div>
        <div className="auth-logo"><h1>Lab<span>Hub</span></h1></div>
        <div className="auth-box">
          <h2>Create your account</h2>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="e.g. john_doe"
              value={form.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input type="password" name="confirm" placeholder="Re-enter password"
              value={form.confirm} onChange={handleChange} />
          </div>
          <button className="auth-btn" onClick={submit} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <hr className="divider" />
          <div className="auth-footer">
            Already have an account? <Link to="/">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}