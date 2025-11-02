import React from 'react'
import { useNavigate } from 'react-router-dom'
//import { getAvailableItems } from '../../api/items'
import ItemCard from '../../components/ItemCard'
import { useSession } from '../../session'
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

export default function BorrowerItemsList() {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const navigate = useNavigate()
  const { user } = useSession()

  const loadItems = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_BASE}/api/items`)
      if (!res.ok) throw new Error('Failed to load items')
      const data = await res.json()
      // show only the logged-in user's items
      setItems(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { loadItems() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div style={{ padding: 16 }}>Loading items…</div>
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ color: 'crimson', marginBottom: 8 }}>Error: {String(error)}</div>
        <button onClick={loadItems}>Retry</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Available Items</h2>
      {items.length === 0 ? (
        <div>No items available right now.</div>
      ) : (
        <div style={{ marginTop: 16 }}>
          {items.map(i => (
            <ItemCard
              key={i.id}
              item={i}
              onSelect={(id) => navigate(`/borrower/items/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
