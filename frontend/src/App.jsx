import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/predict')
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
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

  const riskColor = {
    High: '#c1443b',
    Medium: '#c98a2e',
    Low: '#2f8f6f',
  }

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'All' || item.Predicted_Risk === filter
    const matchesSearch = item.Item_Name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) return <div className="status-message">Loading inventory data...</div>
  if (error) return <div className="status-message error">{error}</div>

  return (
    <div className="dashboard">
      <div className="topbar">
        <div>
          <div className="eyebrow">
            <span className="dot"></span>
            Live risk model
          </div>
          <h1>Hospital Supply Chain Risk Dashboard</h1>
        </div>
        <div className="item-count">
          <strong>{items.length}</strong> items tracked
        </div>
      </div>

      <div className="summary-cards">
        <div className="card" style={{ borderTopColor: riskColor.High }}>
          <span className="count">{riskCounts.High}</span>
          <span className="label">High Risk</span>
        </div>
        <div className="card" style={{ borderTopColor: riskColor.Medium }}>
          <span className="count">{riskCounts.Medium}</span>
          <span className="label">Medium Risk</span>
        </div>
        <div className="card" style={{ borderTopColor: riskColor.Low }}>
          <span className="count">{riskCounts.Low}</span>
          <span className="label">Low Risk</span>
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
        <input
          type="text"
          placeholder="Search item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Current Stock</th>
              <th>Restock Lead Time</th>
              <th>Vendor</th>
              <th>Risk</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.Item_ID}
                data-risk={item.Predicted_Risk}
                onClick={() => setSelectedItem(item)}
              >
                <td>{item.Item_Name}</td>
                <td className="num">{item.Current_Stock}</td>
                <td className="num">{item.Restock_Lead_Time} days</td>
                <td>{item.Vendor_Name}</td>
                <td>
                  <span
                    className="risk-badge"
                    style={{ backgroundColor: riskColor[item.Predicted_Risk] }}
                  >
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
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
            <h2>{selectedItem.Item_Name}</h2>
            <span
              className="risk-badge large"
              style={{ backgroundColor: riskColor[selectedItem.Predicted_Risk] }}
            >
              {selectedItem.Predicted_Risk} Risk
            </span>
            <div className="detail-grid">
              <div>
                <strong>{selectedItem.Current_Stock}</strong>
                Current stock (units)
              </div>
              <div>
                <strong>~{selectedItem.Days_Until_Stockout}</strong>
                Days until stockout
              </div>
              <div>
                <strong>{selectedItem.Restock_Lead_Time}</strong>
                Restock lead time (days)
              </div>
              <div>
                <strong style={{ fontSize: '14px' }}>{selectedItem.Vendor_Name}</strong>
                Vendor
              </div>
            </div>
            <div className="why-box">
              <strong>Why this risk level?</strong>
              <p>{selectedItem.Reason}</p>
            </div>
            <p className="disclaimer-small">
              This is a decision-support estimate based on a synthetic prototype model — not a guaranteed outcome or a substitute for professional judgment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App