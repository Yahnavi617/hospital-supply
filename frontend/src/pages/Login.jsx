import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // NOTE: this will be wired to a real Flask login endpoint next —
    // for now this is just the page/route structure.
    setError('Login is not connected to the backend yet.')
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-mark" style={{ margin: '0 auto 16px' }}>M</div>
        <h1>MedTrack AI</h1>
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
      </form>
    </div>
  )
}

export default Login