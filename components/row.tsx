import React from 'react'
import Tile from './tile'

export default function Row() {
  const tiles = [1, 2, 3]

  return (
    <div>
      {tiles.map((tile) => (
        <Tile key={tile} />
      ))}
    </div>
  )
}
