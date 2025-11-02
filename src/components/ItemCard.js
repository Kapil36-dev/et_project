
import React from 'react'

export default function ItemCard({ item, onSelect, actions }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <h3 style={{ margin: 0 }}>{item.itemName}</h3>
      <p style={{ margin: '6px 0' }}>{item.description}</p>
      <p style={{ margin: '6px 0' }}>Fee: {item.rentalFee}</p>
      <p style={{ margin: '6px 0' }}>Status: {item.status}</p>
      {onSelect && <button onClick={() => onSelect(item.id)}>View</button>}
      {actions}
    </div>
  )
}
