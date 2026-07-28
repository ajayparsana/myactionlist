import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import EisenhowerMatrix from './components/EisenhowerMatrix'
import DailyStats from './components/DailyStats'
import AddTaskModal from './components/AddTaskModal'
import LoginPage from './components/LoginPage'
import { useTaskStore } from './store/taskStore'
import { isAuthenticated, logout } from './utils/auth'

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated())
  const { fetchTasks, isLoading, error } = useTaskStore()

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks()
    }
  }, [isLoggedIn, fetchTasks])

  const handleOpenAddModal = () => {
    setEditingTask(null)
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingTask(null)
  }

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return (
    <div>
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>MyActionList</h1>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
          >
            Logout
          </button>
        </div>
        <nav className="container" style={{ marginTop: '1rem' }}>
          <div className="nav-tabs">
            <button
              className={activeTab === 'tasks' ? 'active' : ''}
              onClick={() => setActiveTab('tasks')}
            >
              📋 Tasks
            </button>
            <button
              className={activeTab === 'matrix' ? 'active' : ''}
              onClick={() => setActiveTab('matrix')}
            >
              ⊞ Matrix
            </button>
            <button
              className={activeTab === 'stats' ? 'active' : ''}
              onClick={() => setActiveTab('stats')}
            >
              📊 Stats
            </button>
          </div>
        </nav>
      </header>

      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            Error: {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : activeTab === 'tasks' ? (
          <TaskList
            onEditTask={(task) => {
              setEditingTask(task)
              setShowAddModal(true)
            }}
          />
        ) : activeTab === 'matrix' ? (
          <EisenhowerMatrix />
        ) : (
          <DailyStats />
        )}
      </main>

      {activeTab === 'tasks' && (
        <button
          className="fab"
          onClick={handleOpenAddModal}
          title="Add new task"
        >
          +
        </button>
      )}

      <AddTaskModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        taskToEdit={editingTask}
      />
    </div>
  )
}
