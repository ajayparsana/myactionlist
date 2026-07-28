import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { formatDistanceToNow } from 'date-fns'
import TaskCard from './TaskCard'
import PomodoroTimer from './PomodoroTimer'

export default function TaskList() {
  const { tasks } = useTaskStore()
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState(null)

  const pendingTasks = tasks.filter(t => t.status !== 'done')
  const completedTasks = tasks.filter(t => t.status === 'done')

  if (selectedTaskForTimer) {
    return (
      <PomodoroTimer
        task={selectedTaskForTimer}
        onClose={() => setSelectedTaskForTimer(null)}
      />
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h2>No tasks yet</h2>
        <p>Click the + button to add your first task and start staying focused!</p>
      </div>
    )
  }

  return (
    <div>
      {pendingTasks.length > 0 && (
        <section>
          <h2 style={{ marginBottom: '1rem' }}>
            Pending ({pendingTasks.length})
          </h2>
          {pendingTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStartTimer={() => setSelectedTaskForTimer(task)}
            />
          ))}
        </section>
      )}

      {completedTasks.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>
            Completed ({completedTasks.length})
          </h2>
          {completedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStartTimer={() => setSelectedTaskForTimer(task)}
            />
          ))}
        </section>
      )}
    </div>
  )
}
