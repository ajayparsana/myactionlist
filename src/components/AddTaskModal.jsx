import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { v4 as uuidv4 } from 'uuid'

const TAGS = ['Work', 'Personal', 'Health', 'Learning']

export default function AddTaskModal({ isOpen, onClose }) {
  const { createTask } = useTaskStore()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleToggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await createTask({
        id: uuidv4(),
        title: title.trim(),
        notes: notes.trim() || null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        tags: selectedTags.length > 0 ? selectedTags : null,
        quadrant: 'unassigned',
        order_index: 0,
        status: 'pending',
        pomodoro_count: 0,
      })

      setTitle('')
      setNotes('')
      setDueDate('')
      setSelectedTags([])
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal open">
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Task</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add details..."
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {TAGS.map(tag => (
                <label key={tag} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${selectedTags.includes(tag) ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  background: selectedTags.includes(tag) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleToggleTag(tag)}
                    disabled={isLoading}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
