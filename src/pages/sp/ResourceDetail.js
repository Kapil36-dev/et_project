
import React from 'react'
import { useParams } from 'react-router-dom'
//import { getItem, updateItem } from '../../api/items'

export default function SpResourceDetail() {
  const { id } = useParams()
  const [item, setItem] = React.useState(null)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  

  const onSave = async (e) => {
    e.preventDefault()
    if (!id || !item) return
    setSaving(true)
    setError('')
    try {
      
      alert('Saved')
    } catch (e) {
      console.error(e)
      setError('Failed to save item.')
    } finally {
      setSaving(false)
    }
  }

  if (!item) return <div style={{ padding: 16 }}>Loading...</div>

  return (
    <div style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 600 }}>
      <h2>Resource Detail</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label>
        Name
        <input value={item.itemName} onChange={(e) => setItem({ ...item, itemName: e.target.value })} />
      </label>
      <label>
        Description
        <textarea value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
      </label>
      <label>
        Rental Fee
        <input type="number" value={item.rentalFee} onChange={(e) => setItem({ ...item, rentalFee: Number(e.target.value) })} />
      </label>
      <div>
        <strong>Status:</strong> {item.status}
      </div>
      <button onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
    </div>
  )
}
