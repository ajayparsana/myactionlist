import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import EisenhowerMatrix from './components/EisenhowerMatrix'
import AddTaskModal from './components/AddTaskModal'
import { useTaskStore } from './store/taskStore'

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [showAddModal, setShowAddModal] = useState(false)
  const { fetchTasks, isLoading, error } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div>
      <header>
        <div className="container">
          <h1>MyActionList</h1>
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
          </div>
        </div>
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
          <TaskList />
        ) : (
          <EisenhowerMatrix />
        )}
      </main>

      {activeTab === 'tasks' && (
        <button
          className="fab"
          onClick={() => setShowAddModal(true)}
          title="Add new task"
        >
          +
        </button>
      )}

      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  )
}
