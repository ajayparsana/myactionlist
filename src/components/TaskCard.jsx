import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { formatDistanceToNow } from 'date-fns'

export default function TaskCard({ task, onStartTimer }) {
  const { toggleComplete, deleteTask } = useTaskStore()
  const [showDelete, setShowDelete] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteTask(task.id)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleToggle = async () => {
    try {
      await toggleComplete(task)
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }

  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    }}>
      <input
        type="checkbox"
        checked={task.status === 'done'}
        onChange={handleToggle}
        style={{ marginTop: '0.25rem', flexShrink: 0 }}
      />

      <div style={{ flex: 1 }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          opacity: task.status === 'done' ? 0.6 : 1,
        }}>
          {task.title}
        </h3>

        {task.notes && (
          <p style={{ margin: '0.5rem 0', color: 'var(--text-gray)', fontSize: '0.875rem' }}>
            {task.notes}
          </p>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {task.due_date && (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-gray)' }}>
              📅 Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
            </span>
          )}
          {task.pomodoro_count > 0 && (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-gray)' }}>
              🍅 {task.pomodoro_count} session{task.pomodoro_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="tag-list">
            {task.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button
          className="btn btn-secondary btn-small"
          onClick={() => onStartTimer()}
          title="Start Pomodoro"
        >
          ⏱
        </button>
        <button
          className="btn btn-secondary btn-small"
          onClick={() => setShowDelete(!showDelete)}
          title="Delete"
        >
          🗑
        </button>
      </div>

      {showDelete && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          background: 'var(--bg-white)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          zIndex: 10,
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Delete "{task.title}"?</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-danger btn-small" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn btn-secondary btn-small" onClick={() => setShowDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
