import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PRCard.css'

const STATUS_CLASS = {
  open: 'status-open', approved: 'status-approved',
  rejected: 'status-rejected', merged: 'status-merged', closed: 'status-closed',
}
const STATUS_ICON = {
  open: '●', approved: '✓', rejected: '✕', merged: '⎇', closed: '○',
}

export default function PRCard({ pr }) {
  const nav = useNavigate()

  const timeAgo = (dateStr) => {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const days  = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    const mins  = Math.floor(diff / 60000)
    if (days  > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${mins}m ago`
  }

  return (
    <div className="pr-card" onClick={() => nav(`/pr/${pr.id}`)}>
      <div className="pr-card-left">
        <div className="pr-card-title">{pr.title}</div>
        <div className="pr-card-meta">
          <span>#{pr.id}</span>
          <span>by <strong>{pr.author}</strong></span>
          <span className="pr-branch">{pr.source_branch} → {pr.target_branch}</span>
          <span>{timeAgo(pr.created_at)}</span>
        </div>
      </div>
      <div className="pr-card-right">
        <span className={`pr-status-badge ${STATUS_CLASS[pr.status]}`}>
          <span className="status-icon">{STATUS_ICON[pr.status]}</span>
          {pr.status}
        </span>
      </div>
    </div>
  )
}