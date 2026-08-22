import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

function Analytics() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
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

  const riskColor = {
    High: '#f43f5e',
    Medium: '#f59e0b',
    Low: '#10b981',
  }

  const pieData = ['High', 'Medium', 'Low'].map((level) => ({
    name: level,
    value: items.filter((i) => i.Predicted_Risk === level).length,
  }))

  const categories = [...new Set(items.map((i) => i.Category).filter(Boolean))]
  const barData = categories.map((cat) => {
    const catItems = items.filter((i) => i.Category === cat)
    return {
      name: cat,
      High: catItems.filter((i) => i.Predicted_Risk === 'High').length,
      Medium: catItems.filter((i) => i.Predicted_Risk === 'Medium').length,
      Low: catItems.filter((i) => i.Predicted_Risk === 'Low').length,
    }
  })

  if (loading) return <div className="status-message">Loading analytics...</div>

  return (
    <div className="page-content">
      <div className="page-head">
        <h1>Analytics</h1>
        <p>Risk trends and category breakdown across your inventory.</p>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={riskColor[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Risk by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeeef0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="High" fill={riskColor.High} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Medium" fill={riskColor.Medium} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Low" fill={riskColor.Low} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Analytics