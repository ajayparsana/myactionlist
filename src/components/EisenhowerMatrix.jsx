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

  const unassignedTasks = tasks.filter(t => t.quadrant === 'unassigned')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Sidebar with unassigned tasks */}
      <div style={{
        background: 'var(--bg-white)',
        border: '2px dashed var(--border-color)',
        borderRadius: '0.75rem',
        padding: '1rem',
        maxHeight: '600px',
        overflowY: 'auto',
        position: 'sticky',
        top: '100px'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 600 }}>
          📋 Unassigned ({unassignedTasks.length})
        </h3>
        {unassignedTasks.length === 0 ? (
          <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem', margin: 0 }}>
            All tasks assigned! Drag from matrix to unassign.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {unassignedTasks.map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                style={{
                  background: 'var(--primary-light)',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  cursor: 'grab',
                  opacity: draggedTask?.id === task.id ? 0.5 : 1,
                  transition: 'all 0.2s',
                  fontSize: '0.875rem',
                  border: '1px solid var(--primary-color)',
                }}
              >
                <div style={{ fontWeight: 500, wordBreak: 'break-word' }}>{task.title}</div>
                {task.due_date && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '0.25rem' }}>
                    📅 {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matrix */}
      <div>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-gray)', fontSize: '0.875rem' }}>
          Drag tasks from the sidebar to assign to a quadrant. Drag between quadrants to reclassify.
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
    </div>
  )
}
