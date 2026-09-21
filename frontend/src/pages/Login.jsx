import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('https://medtrack-cje5.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('authToken', data.token)
        navigate('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Could not connect to server')
    }
  }

  return (
    <div className="login-split">
      <div className="login-brand-panel">
        <div className="login-brand-top">
          <div className="brand-mark light">M</div>
          <span className="login-brand-name">MedTrack AI</span>
        </div>

        <div className="login-brand-mid">
          <h1>Know what's running low, before it runs out.</h1>
          <p>
            Real-time stockout risk across every SKU in your hospital's supply chain —
            explained in very good manner .
          </p>
        </div>

        <div className="login-brand-stats">
          <div>
            <strong>2,500</strong>
            <span>SKUs tracked</span>
          </div>
          <div>
            <strong>3</strong>
            <span>Risk tiers</span>
          </div>
          <div>
            <strong>Live</strong>
            <span>Model status</span>
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="login-sub">Sign in to access the risk dashboard</p>

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">Sign in</button>

          <p className="login-hint">Demo account — username: admin, password: hospital123</p>
        </form>
      </div>
    </div>
  )
}

export default Login