import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import TaskCard from './TaskCard'
import PomodoroTimer from './PomodoroTimer'

export default function TaskList({ onEditTask }) {
  const { tasks, reorderTasks } = useTaskStore()
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState(null)
  const [draggedTaskId, setDraggedTaskId] = useState(null)

  const pendingTasks = tasks.filter(t => t.status !== 'done')
  const completedTasks = tasks.filter(t => t.status === 'done')

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetTaskId) => {
    e.preventDefault()
    if (!draggedTaskId || draggedTaskId === targetTaskId) {
      setDraggedTaskId(null)
      return
    }

    const draggedIndex = pendingTasks.findIndex(t => t.id === draggedTaskId)
    const targetIndex = pendingTasks.findIndex(t => t.id === targetTaskId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTaskId(null)
      return
    }

    const reordered = [...pendingTasks]
    const [draggedTask] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, draggedTask)

    try {
      await reorderTasks(reordered)
    } catch (err) {
      console.error('Failed to reorder tasks:', err)
    }

    setDraggedTaskId(null)
  }

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
          <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            💡 Drag tasks to reorder by your preference
          </p>
          {pendingTasks.map((task, index) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task.id)}
              style={{
                opacity: draggedTaskId === task.id ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <TaskCard
                task={task}
                onStartTimer={() => setSelectedTaskForTimer(task)}
                onEdit={() => onEditTask?.(task)}
                isDragging={draggedTaskId === task.id}
              />
            </div>
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
              onEdit={() => onEditTask?.(task)}
            />
          ))}
        </section>
      )}
    </div>
  )
}
