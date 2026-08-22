import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Reports() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
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
      .catch(() => setLoading(false))
  }, [])

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

  if (loading) return <div className="status-message">Loading report data...</div>

  return (
    <div className="page-content">
      <div className="page-head">
        <h1>Reports</h1>
        <p>Export inventory risk data for offline review.</p>
      </div>

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
          ⬇ Download CSV
        </button>

        <p className="disclaimer-small" style={{ marginTop: 16 }}>
          Export reflects live prototype data based on the current risk model — for demonstration
          and offline review purposes.
        </p>
      </div>
    </div>
  )
}

export default Reports