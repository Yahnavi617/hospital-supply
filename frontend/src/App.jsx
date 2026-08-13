import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    High: '#e74c3c',
    Medium: '#f39c12',
    Low: '#27ae60',
  }

  if (loading) return <div className="status-message">Loading inventory data...</div>
  if (error) return <div className="status-message error">{error}</div>

  return (
    <div className="dashboard">
      <h1>Hospital Supply Chain Risk Dashboard</h1>

      <div className="summary-cards">
        <div className="card" style={{ borderColor: riskColor.High }}>
          <span className="count">{riskCounts.High}</span>
          <span className="label">High Risk</span>
        </div>
        <div className="card" style={{ borderColor: riskColor.Medium }}>
          <span className="count">{riskCounts.Medium}</span>
          <span className="label">Medium Risk</span>
        </div>
        <div className="card" style={{ borderColor: riskColor.Low }}>
          <span className="count">{riskCounts.Low}</span>
          <span className="label">Low Risk</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Current Stock</th>
            <th>Restock Lead Time (days)</th>
            <th>Vendor</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.Item_ID}>
              <td>{item.Item_Name}</td>
              <td>{item.Current_Stock}</td>
              <td>{item.Restock_Lead_Time}</td>
              <td>{item.Vendor_Name}</td>
              <td>
                <span
                  className="risk-badge"
                  style={{ backgroundColor: riskColor[item.Predicted_Risk] }}
                >
                  {item.Predicted_Risk}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App