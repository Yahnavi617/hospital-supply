import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Reports() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://medtrack-cje5.onrender.com/predict', {
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
      .catch(() => setLoading(false))
  }, [])

  const riskCounts = {
    High: items.filter((i) => i.Predicted_Risk === 'High').length,
    Medium: items.filter((i) => i.Predicted_Risk === 'Medium').length,
    Low: items.filter((i) => i.Predicted_Risk === 'Low').length,
  }

  const filteredItems = items.filter(
    (item) => filter === 'All' || item.Predicted_Risk === filter
  )

  const downloadCSV = () => {
    if (filteredItems.length === 0) return

    const headers = Object.keys(filteredItems[0])
    const csvRows = [
      headers.join(','),
      ...filteredItems.map((item) =>
        headers.map((h) => `"${String(item[h]).replace(/"/g, '""')}"`).join(',')
      ),
    ]
    const csvContent = csvRows.join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `inventory_risk_report_${filter.toLowerCase()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- Derived insights for the summary section (computed from real data) ---
  const avgStockout = filteredItems.length
    ? (
        filteredItems.reduce((sum, i) => sum + Number(i.Days_Until_Stockout || 0), 0) /
        filteredItems.length
      ).toFixed(1)
    : '—'

  const countBy = (key) => {
    const counts = {}
    filteredItems.forEach((i) => {
      const val = i[key]
      if (val) counts[val] = (counts[val] || 0) + 1
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted.length ? sorted[0] : ['—', 0]
  }

  const [topCategory, topCategoryCount] = countBy('Category')
  const [topVendor, topVendorCount] = countBy('Vendor_Name')

  if (loading) return <div className="status-message">Loading report data...</div>

  return (
    <div className="page-content">
      <div className="page-head">
        <h1>Reports</h1>
        <p>Export inventory risk data for offline review.</p>
      </div>

      <div className="summary-cards">
        <div className="card card-high">
          <div className="card-top">
            <span className="card-label">High Risk</span>
            <span className="card-icon">⚠</span>
          </div>
          <div className="card-number">{riskCounts.High}</div>
          <div className="card-sub">Available for export</div>
        </div>
        <div className="card card-medium">
          <div className="card-top">
            <span className="card-label">Medium Risk</span>
            <span className="card-icon">◎</span>
          </div>
          <div className="card-number">{riskCounts.Medium}</div>
          <div className="card-sub">Available for export</div>
        </div>
        <div className="card card-low">
          <div className="card-top">
            <span className="card-label">Low Risk</span>
            <span className="card-icon">✓</span>
          </div>
          <div className="card-number">{riskCounts.Low}</div>
          <div className="card-sub">Available for export</div>
        </div>
      </div>

      <div className="reports-layout">
        <div className="report-card">
          <div className="report-row">
            <div>
              <div className="report-label">Risk level</div>
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
            </div>
            <div className="report-count">
              <span className="report-count-num">{filteredItems.length}</span>
              <span>items in this report</span>
            </div>
          </div>

          <button className="download-btn" onClick={downloadCSV}>
            Download CSV
          </button>

          <p className="disclaimer-small" style={{ marginTop: 16 }}>
            Export reflects live prototype data based on the current risk model — for
            demonstration and offline review purposes.
          </p>
        </div>

        <div className="preview-card">
          <h3>Preview</h3>
          <p className="preview-sub">First 6 items in the current selection</p>
          <table className="preview-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Risk</th>
                <th>Stockout</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.slice(0, 6).map((item) => (
                <tr key={item.Item_ID}>
                  <td>{item.Item_Name}</td>
                  <td>
                    <span className={`risk-chip risk-${item.Predicted_Risk.toLowerCase()}`}>
                      {item.Predicted_Risk}
                    </span>
                  </td>
                  <td className="num">~{item.Days_Until_Stockout}d</td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
                    No items match this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="insight-card">
        <h3>Report Summary</h3>
        <div className="insight-grid">
          <div className="insight-box">
            <span className="insight-label">Avg. days to stockout</span>
            <span className="insight-value">{avgStockout}<small>days</small></span>
          </div>
          <div className="insight-box">
            <span className="insight-label">Top affected category</span>
            <span className="insight-value small">{topCategory}</span>
            <span className="insight-footnote">{topCategoryCount} items</span>
          </div>
          <div className="insight-box">
            <span className="insight-label">Top affected vendor</span>
            <span className="insight-value small">{topVendor}</span>
            <span className="insight-footnote">{topVendorCount} items</span>
          </div>
        </div>
        <p className="insight-text">
          Within the current selection ({filter === 'All' ? 'all risk levels' : `${filter} risk`}),
          items have an average stock coverage of {avgStockout} days. {topCategory !== '—' && (
            <>The <strong>{topCategory}</strong> category accounts for the largest share of these
            items, and <strong>{topVendor}</strong> is the most represented vendor — useful starting
            points for a procurement review.</>
          )}
        </p>
      </div>
    </div>
  )
}

export default Reports