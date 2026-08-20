import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [sortBy, setSortBy] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const navigate = useNavigate()

  useEffect(() => {
  fetch('http://127.0.0.1:5000/predict', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  })
    .then((res) => {
      if (res.status === 401) {
        navigate('/login')
        return null
      }
      return res.json()
    })
    .then((data) => {
      if (data) {
        setItems(data)
        setLoading(false)
      }
    })
    .catch((err) => {
      setError('Could not connect to backend. Make sure Flask server is running.')
      setLoading(false)
    })
    }, [])

  const riskCounts = {
    High: items.filter((i) => i.Predicted_Risk === 'High').length,
    Medium: items.filter((i) => i.Predicted_Risk === 'Medium').length,
    Low: items.filter((i) => i.Predicted_Risk === 'Low').length,
  }

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'All' || item.Predicted_Risk === filter
    const matchesSearch = item.Item_Name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortBy) return 0
    const valA = a[sortBy]
    const valB = b[sortBy]
    if (typeof valA === 'number') {
      return sortDir === 'asc' ? valA - valB : valB - valA
    }
    return sortDir === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA))
  })

  if (loading) return <div className="status-message">Loading inventory data...</div>
  if (error) return <div className="status-message error">{error}</div>

  return (
    <div className="page-content">
      <div className="page-head">
        <h1>Supply Chain Overview</h1>
        <p>Real-time risk assessment across {items.length.toLocaleString()} tracked SKUs.</p>
      </div>

      <div className="summary-cards">
        <div className="card card-high">
          <div className="card-top">
            <span className="card-label">Critical Shortage</span>
            <span className="card-icon">⚠</span>
          </div>
          <div className="card-number">{riskCounts.High}</div>
          <div className="card-sub">Needs immediate review</div>
        </div>
        <div className="card card-medium">
          <div className="card-top">
            <span className="card-label">Watchlist</span>
            <span className="card-icon">◎</span>
          </div>
          <div className="card-number">{riskCounts.Medium}</div>
          <div className="card-sub">Limited buffer remaining</div>
        </div>
        <div className="card card-low">
          <div className="card-top">
            <span className="card-label">Stable Inventory</span>
            <span className="card-icon">✓</span>
          </div>
          <div className="card-number">{riskCounts.Low}</div>
          <div className="card-sub">Sufficient coverage</div>
        </div>
      </div>

      <div className="controls">
        <div className="filter-buttons">
          {['All', 'High', 'Medium', 'Low'].map((level) => (
            <button
              key={level}
              className={filter === level ? 'active' : ''}
              onClick={() => setFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search SKUs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th onClick={() => handleSort('Current_Stock')} className="sortable">
                Current Stock {sortBy === 'Current_Stock' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Restock_Lead_Time')} className="sortable">
                Restock Lead Time {sortBy === 'Restock_Lead_Time' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th>Vendor</th>
              <th>Risk</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr
                key={item.Item_ID}
                className={selectedItem?.Item_ID === item.Item_ID ? 'row-selected' : ''}
                onClick={() => setSelectedItem(item)}
              >
                <td className="item-name">{item.Item_Name}</td>
                <td className="num">{item.Current_Stock} units</td>
                <td className="num">{item.Restock_Lead_Time} days</td>
                <td>{item.Vendor_Name}</td>
                <td>
                  <span className={`risk-chip risk-${item.Predicted_Risk.toLowerCase()}`}>
                    {item.Predicted_Risk}
                  </span>
                </td>
                <td className="reason-text">{item.Reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="side-panel-overlay" onClick={() => setSelectedItem(null)}>
          <div className="side-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>

            <h2>{selectedItem.Item_Name}</h2>
            <span className={`risk-chip risk-${selectedItem.Predicted_Risk.toLowerCase()} large`}>
              {selectedItem.Predicted_Risk} Risk
            </span>
            <p className="panel-desc">
              Category: {selectedItem.Category || 'Medical supply'}. Monitored continuously against
              consumption rate and supplier lead time.
            </p>

            <div className="detail-grid">
              <div className="detail-box">
                <span className="detail-icon">▤</span>
                <span className="detail-label">Current Stock</span>
                <span className="detail-value">{selectedItem.Current_Stock} <small>units</small></span>
              </div>
              <div className="detail-box">
                <span className="detail-icon">◷</span>
                <span className="detail-label">Days to Stockout</span>
                <span className="detail-value">~{selectedItem.Days_Until_Stockout} <small>days</small></span>
              </div>
              <div className="detail-box">
                <span className="detail-icon">→</span>
                <span className="detail-label">Lead Time</span>
                <span className="detail-value">{selectedItem.Restock_Lead_Time} <small>days</small></span>
              </div>
              <div className="detail-box">
                <span className="detail-icon">⬡</span>
                <span className="detail-label">Vendor</span>
                <span className="detail-value small-text">{selectedItem.Vendor_Name}</span>
              </div>
            </div>

            <div className={`why-box why-${selectedItem.Predicted_Risk.toLowerCase()}`}>
              <strong>Why this risk level?</strong>
              <p>{selectedItem.Reason}</p>
            </div>

            <p className="disclaimer-small">
              Data reflects a synthetic prototype model for demonstration purposes — a decision-support
              estimate, not a guaranteed outcome or a substitute for professional judgment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard