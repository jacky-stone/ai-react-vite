import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Configure Worker API URL
const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'https://ai-worker.YOUR_SUBDOMAIN.workers.dev'

function App() {
  const [count, setCount] = useState(0)
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Call Worker API
  const callWorkerAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      // Option 1: Use Pages Function proxy (if configured)
      const response = await fetch('/api/hello')

      // Option 2: Direct Worker call (uncomment if not using proxy)
      // const response = await fetch(`${WORKER_URL}/api/hello`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      setError(err.message)
      console.error('Error calling Worker API:', err)
    } finally {
      setLoading(false)
    }
  }

  // Call Worker Echo API
  const callEchoAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      // Option 1: Use Pages Function proxy (if configured)
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello from React!', count })
      })

      // Option 2: Direct Worker call (uncomment if not using proxy)
      // const response = await fetch(`${WORKER_URL}/api/echo`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: 'Hello from React!', count })
      // })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      setError(err.message)
      console.error('Error calling Worker API:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Worker</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* Worker API Section */}
      <div className="card">
        <h2>Test Worker API</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={callWorkerAPI} disabled={loading}>
            {loading ? 'Loading...' : 'Call /api/hello'}
          </button>
          <button onClick={callEchoAPI} disabled={loading}>
            {loading ? 'Loading...' : 'Call /api/echo'}
          </button>
        </div>

        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Error: {error}
          </div>
        )}

        {apiResponse && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h3>Response from Worker:</h3>
            <pre style={{
              background: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto'
            }}>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
