import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/prdetail.css'
import '../styles/dashboard.css'

export default function PRDetail() {
  const { id } = useParams()
  const nav    = useNavigate()

  const [pr, setPR]                   = useState(null)
  const [comment, setComment]         = useState('')
  const [filePath, setFilePath]       = useState('')
  const [lineNum, setLineNum]         = useState('')
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewNote, setReviewNote]   = useState('')

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const load = () =>
    axios.get(`http://localhost:5000/api/pr/${id}`, { headers })
      .then(r => setPR(r.data))
      .catch(err => { if (err.response?.status === 401) { localStorage.clear(); nav('/') } })

  useEffect(() => { load() }, [])

  const submitReview = async () => {
    await axios.post(`http://localhost:5000/api/pr/${id}/review`,
      { decision: reviewModal, comment: reviewNote }, { headers })
    setReviewModal(null); setReviewNote(''); load()
  }

  const addComment = async () => {
    if (!comment.trim()) return
    await axios.post(`http://localhost:5000/api/pr/${id}/comment`,
      { body: comment, file_path: filePath, line_number: lineNum || null }, { headers })
    setComment(''); setFilePath(''); setLineNum(''); load()
  }

  const initials = (name) => name ? name.slice(0, 2).toUpperCase() : 'U'

  if (!pr) return <div className="loading-state">Loading pull request...</div>

  return (
    <div className="pr-detail-wrapper">
      <Navbar />
      <div className="pr-detail-body">
        <button className="back-btn" onClick={() => nav('/dashboard')}>
          ← Back to dashboard
        </button>

        <h1 className="pr-detail-title">{pr.title}</h1>
        <div className="pr-detail-meta">
          <span className={`status-badge status-${pr.status}`}>{pr.status}</span>
          <span>{pr.source_branch} → {pr.target_branch}</span>
          <span>opened {new Date(pr.created_at).toLocaleDateString()}</span>
        </div>

        {pr.description && <div className="pr-description">{pr.description}</div>}
        {/* Code files viewer */}
{pr.files && pr.files.length > 0 && (
  <div style={{marginBottom: '1.5rem'}}>
    <p className="section-title">
      Code files ({pr.files.length})
    </p>
    {pr.files.map((file, i) => (
      <div key={i} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '12px'
      }}>
        {/* File header */}
        <div style={{
          background: '#1e293b',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#94a3b8',
            fontWeight: '500'
          }}>
            {file.file_path}
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            background: '#334155',
            color: '#94a3b8',
            borderRadius: '20px'
          }}>
            {file.language}
          </span>
        </div>

        {/* Line numbers + code */}
        <div style={{
          background: '#0f172a',
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            <tbody>
              {file.content.split('\n').map((line, lineNum) => {
                const lineComments = pr.comments?.filter(
                  c => c.file_path === file.file_path &&
                  parseInt(c.line_number) === lineNum + 1
                ) || []
                return (
                  <React.Fragment key={lineNum}>
                    <tr
                      style={{cursor: 'pointer'}}
                      onClick={() => {
                        setFilePath(file.file_path)
                        setLineNum(String(lineNum + 1))
                        document.getElementById('comment-box')?.scrollIntoView({behavior: 'smooth'})
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='#1e293b'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <td style={{
                        padding: '2px 16px 2px 8px',
                        color: '#475569',
                        userSelect: 'none',
                        textAlign: 'right',
                        minWidth: '40px',
                        borderRight: '1px solid #1e293b'
                      }}>
                        {lineNum + 1}
                      </td>
                      <td style={{
                        padding: '2px 16px',
                        color: '#e2e8f0',
                        whiteSpace: 'pre'
                      }}>
                        {line || ' '}
                      </td>
                    </tr>
                    {/* Show comments for this line */}
                    {lineComments.map(c => (
                      <tr key={c.id}>
                        <td></td>
                        <td style={{padding: '0 16px 8px'}}>
                          <div style={{
                            background: '#1e3a5f',
                            border: '1px solid #2563eb',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            marginTop: '4px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#93c5fd',
                              fontFamily: 'inherit'
                            }}>
                              {c.username}
                            </span>
                            <p style={{
                              fontSize: '12px',
                              color: '#cbd5e1',
                              margin: '4px 0 0',
                              fontFamily: 'inherit',
                              whiteSpace: 'normal'
                            }}>
                              {c.body}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Click line hint */}
        <div style={{
          background: '#1e293b',
          padding: '6px 16px',
          fontSize: '11px',
          color: '#475569'
        }}>
          Click any line to comment on it
        </div>
      </div>
    ))}
  </div>
)}

{/* Show review buttons only if PR is open */}
{pr.status === 'open' && (
  <>
    <p className="section-title">Review this PR</p>
    <div className="action-bar">
      <button className="btn-approve"
        onClick={() => setReviewModal('approved')}>
        Approve
      </button>
      <button className="btn-reject"
        onClick={() => setReviewModal('rejected')}>
        Reject
      </button>
      <button className="btn-changes"
        onClick={() => setReviewModal('changes_requested')}>
        Request Changes
      </button>
    </div>
  </>
)}

{/* Show status message if PR is closed */}
{pr.status !== 'open' && (
  <div style={{
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '1rem',
    fontSize: '13px',
    fontWeight: '500',
    background:
      pr.status === 'approved' ? '#dafbe1' :
      pr.status === 'rejected' ? '#ffebe9' :
      pr.status === 'merged'   ? '#eedcff' : '#f0f0f0',
    color:
      pr.status === 'approved' ? '#1a7f37' :
      pr.status === 'rejected' ? '#cf222e' :
      pr.status === 'merged'   ? '#8250df' : '#57606a',
  }}>
    {pr.status === 'approved' && 'This PR has been approved and is ready to merge.'}
    {pr.status === 'rejected' && 'This PR was rejected. The author needs to fix the issues and open a new PR.'}
    {pr.status === 'merged'   && 'This PR has been merged into the main branch successfully.'}
    {pr.status === 'closed'   && 'This PR is closed.'}
  </div>
)}

        <p className="section-title">Reviews ({pr.reviews?.length || 0})</p>
        {pr.reviews?.length === 0 && <p style={{fontSize:13,color:'#57606a'}}>No reviews yet.</p>}
        {pr.reviews?.map(r => (
          <div key={r.id} className="review-card">
            <div className={`review-avatar ${r.decision}`}>{initials(r.username)}</div>
            <div>
              <span className="review-username">{r.username}</span>
              <span className={`review-decision decision-${r.decision}`}>
                {r.decision.replace('_',' ')}
              </span>
              {r.comment && <p className="review-comment">{r.comment}</p>}
            </div>
          </div>
        ))}

        <p className="section-title">Comments ({pr.comments?.length || 0})</p>
        {pr.comments?.map(c => (
          <div key={c.id} className="comment-card">
            <div className="comment-header">
              <span className="comment-username">{c.username}</span>
              {c.file_path && (
                <span className="comment-file">
                  {c.file_path}{c.line_number ? `:${c.line_number}` : ''}
                </span>
              )}
            </div>
            <p className="comment-body">{c.body}</p>
          </div>
        ))}

        <div className="comment-form">
          <h4>Add a comment</h4>
          <div id="comment-box" />
{filePath && lineNum && (
  <div style={{
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#1d4ed8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <span>
      Commenting on <strong>{filePath}</strong> line <strong>{lineNum}</strong>
    </span>
    <button
      onClick={() => { setFilePath(''); setLineNum('') }}
      style={{
        background: 'none', border: 'none',
        color: '#6b7280', cursor: 'pointer', fontSize: '16px'
      }}
    >
      ×
    </button>
  </div>
)}
          <textarea placeholder="Write your comment here..."
            value={comment} onChange={e => setComment(e.target.value)} />
          <input placeholder="File path (optional)" value={filePath}
            onChange={e => setFilePath(e.target.value)} />
          <input placeholder="Line number (optional)" type="number"
            value={lineNum} onChange={e => setLineNum(e.target.value)} />
          <button className="btn-comment" onClick={addComment}>Add comment</button>
        </div>
      </div>

      {reviewModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div className="review-modal">
            <h3>
              {reviewModal === 'approved' && 'Approve this PR'}
              {reviewModal === 'rejected' && 'Reject this PR'}
              {reviewModal === 'changes_requested' && 'Request Changes'}
            </h3>
            <textarea placeholder="Add a note (optional)..."
              value={reviewNote} onChange={e => setReviewNote(e.target.value)} />
            <div className="review-modal-actions">
              <button onClick={() => { setReviewModal(null); setReviewNote('') }}
                style={{ padding:'7px 16px', fontSize:13, border:'1px solid #d0d7de',
                  background:'#fff', borderRadius:8, cursor:'pointer' }}>Cancel</button>
              <button onClick={submitReview}
                style={{ padding:'7px 16px', fontSize:13, fontWeight:600,
                  background: reviewModal==='approved'?'#2da44e':reviewModal==='rejected'?'#cf222e':'#f0883e',
                  color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>
                Confirm {reviewModal.replace('_',' ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}