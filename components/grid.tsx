import React from 'react'
import Row from './row'

export default function Grid() {
  const rows = [1, 2, 3] // want to create a 3 x 3 grid

  return (
    <div className="flex">
      {rows.map((row) => (
        <Row key={row} />
      ))}
    </div>
  )
}
