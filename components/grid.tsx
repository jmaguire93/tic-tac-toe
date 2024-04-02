'use client'

import React from 'react'
import Tile from './tile'
import useCheckGameState from '@/hooks/use-check-game-state'

export default function Grid() {
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9] // 3 x 3 grid

  // hook for handling game state checking
  useCheckGameState()

  return (
    <div className="grid grid-cols-3 gap-1">
      {tiles.map((tile) => (
        <Tile key={tile} tileId={tile} />
      ))}
    </div>
  )
}
