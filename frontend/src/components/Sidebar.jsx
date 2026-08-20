import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">M</div>
        <div className="brand-name">MedTrack <span>AI</span></div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">▦</span> Dashboard
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">◔</span> Analytics
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">▤</span> Reports
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span className="nav-icon">⏻</span> Log out
      </button>
    </div>
  )
}

export default Sidebar