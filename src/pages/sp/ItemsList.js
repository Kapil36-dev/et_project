import React from 'react'
import { useNavigate } from 'react-router-dom'
import ItemCard from '../../components/ItemCard'
import { useSession } from '../../session'

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

export default function SpItemsList() {
  const [items, setItems] = React.useState([])
  const [form, setForm] = React.useState({
    itemName: '',
    description: '',
    rentalFee: '',
    status: 'AVAILABLE'
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const navigate = useNavigate()
  const { user } = useSession()

  // ✅ Load all items (filtered by user)
  const loadItems = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_BASE}/api/items`)
      if (!res.ok) throw new Error('Failed to load items')
      const data = await res.json()
      // show only the logged-in user's items
      setItems(data.filter(i => i.serviceProviderUserId === user?.userId))
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (user) loadItems()
  }, [user])

  // ✅ Validate before submit
  const validateForm = () => {
    if (!form.itemName.trim()) return 'Item name is required'
    if (!form.description.trim()) return 'Description is required'
    if (!form.rentalFee || form.rentalFee <= 0) return 'Rental fee must be greater than 0'
    return ''
  }

  // ✅ Create new item (POST)
  const onCreate = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      const newItem = {
        itemName: form.itemName,
        description: form.description,
        rentalFee: Number(form.rentalFee),
        serviceProviderUserId: user?.userId,
        status: form.status // align with backend model
      }

      const res = await fetch(`${API_BASE}/api/items/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })

      if (!res.ok) throw new Error('Failed to add item')

      await loadItems()
      setForm({ itemName: '', description: '', rentalFee: '', status: 'AVAILABLE' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Your Items</h2>

      {/* Show any error */}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      {/* ✅ Form for adding new items */}
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
        <input
          placeholder="Item Name"
          value={form.itemName}
          onChange={(e) => setForm(f => ({ ...f, itemName: e.target.value }))}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Rental Fee"
          value={form.rentalFee}
          onChange={(e) => setForm(f => ({ ...f, rentalFee: e.target.value }))}
        />

        {/* ✅ Optional: dropdown for item status */}
        <select
          value={form.status}
          onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RENTED">RENTED</option>
          <option value="UNAVAILABLE">UNAVAILABLE</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      {/* ✅ Display all items */}
      <div style={{ marginTop: 16 }}>
        {loading && <p>Loading items...</p>}
        {!loading && items.length === 0 && <p>No items found.</p>}

        {items.map(i => (
          <ItemCard key={i.id} item={i} onSelect={(id) => navigate(`/sp/items/${id}`)} />
        ))}
      </div>
    </div>
  )
}
