import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const nav  = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.clear()
    setTimeout(() => nav('/'), 100)
  }

  const initials = (name) => name ? name.slice(0, 2).toUpperCase() : 'U'

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => nav('/dashboard')}>
        Lab<span>Hub</span>
      </div>
      <div className="navbar-center">
        <button className="nav-link" onClick={() => nav('/dashboard')}>
          Pull Requests
        </button>
      </div>
      <div className="navbar-user">
        <span className="navbar-username">{user.username}</span>
        <div className="navbar-avatar">{initials(user.username)}</div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  )
}