import { useTaskStore } from '../store/taskStore'

export default function DailyStats() {
  const { tasks } = useTaskStore()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tasksCompletedToday = tasks.filter(t => {
    if (t.status !== 'done') return false
    const updatedDate = new Date(t.updated_at)
    updatedDate.setHours(0, 0, 0, 0)
    return updatedDate.getTime() === today.getTime()
  }).length

  const totalPomodoros = tasks.reduce((sum, t) => sum + (t.pomodoro_count || 0), 0)
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const pendingTasks = tasks.filter(t => t.status !== 'done').length

  const urgentImportant = tasks.filter(t => t.quadrant === 'urgent-important').length
  const notUrgentImportant = tasks.filter(t => t.quadrant === 'not-urgent-important').length
  const urgentNotImportant = tasks.filter(t => t.quadrant === 'urgent-not-important').length
  const notUrgentNotImportant = tasks.filter(t => t.quadrant === 'not-urgent-not-important').length
  const unassigned = tasks.filter(t => t.quadrant === 'unassigned').length

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Today's Focus Summary</h2>

      <div className="stats-grid" style={{ marginBottom: '3rem' }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#22c55e' }}>
            {tasksCompletedToday}
          </div>
          <div className="stat-label">Tasks Completed Today</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {totalPomodoros}
          </div>
          <div className="stat-label">Total Focus Sessions</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {pendingTasks}
          </div>
          <div className="stat-label">Pending Tasks</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Eisenhower Breakdown</h3>
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-value" style={{ color: '#ef4444', fontSize: '2rem' }}>
            {urgentImportant}
          </div>
          <div className="stat-label">Urgent & Important</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-gray)' }}>
            Do now
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div className="stat-value" style={{ color: '#22c55e', fontSize: '2rem' }}>
            {notUrgentImportant}
          </div>
          <div className="stat-label">Not Urgent & Important</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-gray)' }}>
            Schedule
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #eab308' }}>
          <div className="stat-value" style={{ color: '#eab308', fontSize: '2rem' }}>
            {urgentNotImportant}
          </div>
          <div className="stat-label">Urgent & Not Important</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-gray)' }}>
            Delegate
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #d1d5db' }}>
          <div className="stat-value" style={{ color: '#9ca3af', fontSize: '2rem' }}>
            {notUrgentNotImportant}
          </div>
          <div className="stat-label">Not Urgent & Not Important</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-gray)' }}>
            Delete
          </div>
        </div>
      </div>

      {unassigned > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'var(--bg-white)',
          border: '1px dashed var(--border-color)',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: 'var(--text-gray)' }}>
            📌 {unassigned} task{unassigned !== 1 ? 's' : ''} not yet prioritized
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-gray)' }}>
            Visit the Matrix tab to assign these to quadrants
          </p>
        </div>
      )}

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>💡 Tip</h3>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
          Focus on the <strong>Urgent & Important</strong> quadrant to make progress on critical tasks.
          Use the Pomodoro timer to break work into focused 25-minute sessions.
          Remember: completing one task is better than starting five.
        </p>
      </div>
    </div>
  )
}
