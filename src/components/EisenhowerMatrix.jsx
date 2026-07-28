import { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import TaskCard from './TaskCard'

const QUADRANTS = [
  {
    key: 'urgent-important',
    title: 'Urgent & Important',
    action: 'Do Now',
    bgClass: 'quadrant-urgent-important'
  },
  {
    key: 'not-urgent-important',
    title: 'Not Urgent & Important',
    action: 'Schedule',
    bgClass: 'quadrant-not-urgent-important'
  },
  {
    key: 'urgent-not-important',
    title: 'Urgent & Not Important',
    action: 'Delegate',
    bgClass: 'quadrant-urgent-not-important'
  },
  {
    key: 'not-urgent-not-important',
    title: 'Not Urgent & Not Important',
    action: 'Delete',
    bgClass: 'quadrant-not-urgent-not-important'
  },
]

export default function EisenhowerMatrix() {
  const { tasks, updateQuadrant } = useTaskStore()
  const [draggedTask, setDraggedTask] = useState(null)
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState(null)

  const getTasksByQuadrant = (quadrant) => {
    return tasks.filter(t => t.quadrant === quadrant)
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, quadrant) => {
    e.preventDefault()
    if (draggedTask) {
      try {
        await updateQuadrant(draggedTask.id, quadrant)
      } catch (err) {
        console.error('Failed to update quadrant:', err)
      }
      setDraggedTask(null)
    }
  }

  return (
    <div>
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-gray)' }}>
        Drag tasks to organize them by priority. Click tasks to mark complete or use the timer.
      </p>

      <div className="matrix-grid">
        {QUADRANTS.map(quadrant => {
          const quadrantTasks = getTasksByQuadrant(quadrant.key)
          return (
            <div
              key={quadrant.key}
              className={`quadrant ${quadrant.bgClass}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, quadrant.key)}
            >
              <div className="quadrant-header">
                <div>{quadrant.title}</div>
                <div className="quadrant-action">{quadrant.action}</div>
              </div>

              <div className="quadrant-content">
                {quadrantTasks.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'var(--text-gray)',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    padding: '1rem'
                  }}>
                    Drop tasks here
                  </div>
                ) : (
                  quadrantTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="draggable-task"
                      style={{
                        opacity: draggedTask?.id === task.id ? 0.5 : 1,
                        cursor: draggedTask?.id === task.id ? 'grabbing' : 'grab',
                      }}
                    >
                      <div className="card" style={{
                        cursor: 'grab',
                        padding: '0.75rem',
                        marginBottom: '0.5rem',
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={task.status === 'done'}
                            onChange={() => {}}
                            onClick={() => {}}
                            style={{ marginTop: 0 }}
                          />
                          <span style={{
                            flex: 1,
                            textDecoration: task.status === 'done' ? 'line-through' : 'none',
                            opacity: task.status === 'done' ? 0.6 : 1,
                            fontSize: '0.875rem'
                          }}>
                            {task.title}
                          </span>
                        </div>
                        {task.pomodoro_count > 0 && (
                          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-gray)' }}>
                            🍅 {task.pomodoro_count}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
