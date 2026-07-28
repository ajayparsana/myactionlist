import { useState } from 'react'
import { validateCredentials, setAuthenticated } from '../utils/auth'

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (validateCredentials(username, password)) {
        setAuthenticated(true)
        onLoginSuccess()
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: '1rem',
        padding: '3rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>✓</div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            margin: '0 0 0.5rem 0',
            color: 'var(--text-dark)'
          }}>MyActionList</h1>
          <p style={{
            color: 'var(--text-gray)',
            margin: 0,
            fontSize: '0.95rem'
          }}>Focus on what matters most</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-dark)'
            }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              autoFocus
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
                background: 'var(--bg-white)',
                color: 'var(--text-dark)',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-dark)'
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
                background: 'var(--bg-white)',
                color: 'var(--text-dark)',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            style={{
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading || !username || !password ? 0.6 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-gray)',
          marginTop: '2rem',
          margin: '2rem 0 0 0'
        }}>
          Reduce procrastination with smart task management
        </p>
      </div>
    </div>
  )
}
