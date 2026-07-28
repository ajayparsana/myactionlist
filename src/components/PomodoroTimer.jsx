import { useState, useEffect } from 'react'
import { useTaskStore } from '../store/taskStore'

const FOCUS_DURATION = 25 * 60
const SHORT_BREAK_DURATION = 5 * 60
const LONG_BREAK_DURATION = 15 * 60

export default function PomodoroTimer({ task, onClose }) {
  const { incrementPomodoro, toggleComplete } = useTaskStore()
  const [sessionType, setSessionType] = useState('focus')
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(task.pomodoro_count || 0)
  const [showSessionComplete, setShowSessionComplete] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)
    if (sessionType === 'focus') {
      setCompletedSessions(c => c + 1)
      incrementPomodoro(task.id)
      setShowSessionComplete(true)
    } else {
      startFocusSession()
    }
  }

  const startFocusSession = () => {
    setSessionType('focus')
    setTimeLeft(FOCUS_DURATION)
    setShowSessionComplete(false)
  }

  const startBreak = (isLong) => {
    setSessionType(isLong ? 'long-break' : 'short-break')
    setTimeLeft(isLong ? LONG_BREAK_DURATION : SHORT_BREAK_DURATION)
    setShowSessionComplete(false)
    setIsRunning(true)
  }

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setSessionType('focus')
    setTimeLeft(FOCUS_DURATION)
    setShowSessionComplete(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getSessionLabel = () => {
    switch (sessionType) {
      case 'focus':
        return 'Focus Session'
      case 'short-break':
        return 'Short Break'
      case 'long-break':
        return 'Long Break'
      default:
        return ''
    }
  }

  const getSessionColor = () => {
    switch (sessionType) {
      case 'focus':
        return '#ef4444'
      case 'short-break':
        return '#22c55e'
      case 'long-break':
        return '#22c55e'
      default:
        return '#3b82f6'
    }
  }

  const getCircleClass = () => {
    switch (sessionType) {
      case 'focus':
        return 'timer-focus'
      case 'short-break':
        return 'timer-break'
      case 'long-break':
        return 'timer-long-break'
      default:
        return ''
    }
  }

  return (
    <div className="timer-container">
      <div className="timer-card">
        <h2 className="timer-title">{task.title}</h2>

        <div className={`timer-circle ${getCircleClass()}`} style={{
          borderColor: getSessionColor(),
          backgroundColor: `${getSessionColor()}15`,
          color: getSessionColor(),
        }}>
          <div className="timer-display">{formatTime(timeLeft)}</div>
        </div>

        <div className="timer-label">{getSessionLabel()}</div>

        <div className="timer-controls">
          <button
            className="btn btn-primary"
            onClick={toggleTimer}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={resetTimer}
          >
            ↻ Reset
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {completedSessions > 0 && (
          <p style={{ marginTop: '2rem', color: 'var(--text-gray)' }}>
            Completed: {completedSessions} session{completedSessions !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {showSessionComplete && (
        <div className="modal open">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h2>🎉 Session Complete!</h2>
            <p style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              Great work! You've completed {completedSessions} session{completedSessions !== 1 ? 's' : ''}.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => startBreak(completedSessions % 4 === 0)}
              >
                {completedSessions % 4 === 0 ? 'Long Break (15 min)' : 'Short Break (5 min)'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowSessionComplete(false)
                  onClose()
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
