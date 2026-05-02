import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PRCard from '../components/PRCard'
import '../styles/dashboard.css'

export default function Dashboard() {
  const [prs, setPRs]             = useState([])
  const [filter, setFilter]       = useState('all')
  const [showModal, setModal]     = useState(false)
  const [showRepoModal, setRepoModal] = useState(false)
  const [repos, setRepos]         = useState([])
  const [form, setForm]           = useState({
    title:'', description:'', repo_id:'', source_branch:'', target_branch:'main'
  })
  const [repoForm, setRepoForm]   = useState({ name:'', description:'' })

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  const nav     = useNavigate()

  const loadPRs = () => {
    axios.get('http://localhost:5000/api/pr', { headers })
      .then(r => setPRs(r.data))
      .catch(err => { if (err.response?.status === 401) { localStorage.clear(); nav('/') } })
  }

  const loadRepos = () => {
    axios.get('http://localhost:5000/api/repos', { headers })
      .then(r => setRepos(r.data))
      .catch(err => { if (err.response?.status === 401) { localStorage.clear(); nav('/') } })
  }

  useEffect(() => { loadPRs(); loadRepos() }, [])

  const createRepo = async () => {
    if (!repoForm.name) return
    try {
      await axios.post('http://localhost:5000/api/repos', repoForm, { headers })
      setRepoModal(false)
      setRepoForm({ name:'', description:'' })
      loadRepos()
    } catch (err) { alert('Failed: ' + err.response?.data?.error) }
  }

  const createPR = async () => {
    if (!form.title || !form.repo_id || !form.source_branch) return
    try {
      await axios.post('http://localhost:5000/api/pr', form, { headers })
      setModal(false)
      setForm({ title:'', description:'', repo_id:'', source_branch:'', target_branch:'main' })
      loadPRs()
    } catch (err) { alert('Failed: ' + err.response?.data?.error) }
  }

  const filtered = filter === 'all' ? prs : prs.filter(p => p.status === filter)

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-body">
        <div className="dashboard-header">
          <h2>Pull Requests</h2>
          <div style={{ display:'flex', gap:8 }}>
            <button className="new-pr-btn" style={{ background:'#2da44e' }}
              onClick={() => setRepoModal(true)}>+ New Repository</button>
            <button className="new-pr-btn"
              onClick={() => setModal(true)}>+ New Pull Request</button>
          </div>
        </div>

        <div className="filter-bar">
          {['all','open','approved','rejected','merged'].map(f => (
            <button key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="pr-list">
          {filtered.length === 0
            ? <div className="empty-state">No pull requests found.</div>
            : filtered.map(pr => <PRCard key={pr.id} pr={pr} />)
          }
        </div>
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div className="modal-box">
            <h3>Create Pull Request</h3>
            <input placeholder="PR Title *" value={form.title}
              onChange={e => setForm({...form, title:e.target.value})} />
            <textarea placeholder="Description (optional)" rows={3}
              value={form.description}
              onChange={e => setForm({...form, description:e.target.value})} />
            <select value={form.repo_id}
              onChange={e => setForm({...form, repo_id:e.target.value})}>
              <option value="">Select Repository *</option>
              {repos.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input placeholder="Source branch (e.g. feature/login) *"
              value={form.source_branch}
              onChange={e => setForm({...form, source_branch:e.target.value})} />
            <input placeholder="Target branch" value={form.target_branch}
              onChange={e => setForm({...form, target_branch:e.target.value})} />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={createPR}>Create PR</button>
            </div>
          </div>
        </div>
      )}

      {showRepoModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div className="modal-box">
            <h3>Create Repository</h3>
            <input placeholder="Repository name *" value={repoForm.name}
              onChange={e => setRepoForm({...repoForm, name:e.target.value})} />
            <textarea placeholder="Description (optional)" rows={3}
              value={repoForm.description}
              onChange={e => setRepoForm({...repoForm, description:e.target.value})} />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setRepoModal(false)}>Cancel</button>
              <button className="btn-submit" style={{ background:'#2da44e' }}
                onClick={createRepo}>Create Repository</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}