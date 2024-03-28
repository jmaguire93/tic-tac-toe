'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import { GameState, Letter } from '@/types'
import React, { useState } from 'react'

type TileProps = {
  tileId: number
}

export default function Tile({ tileId }: TileProps) {
  const [letter, setLetter] = useState<Letter>('')
  const {
    isPlayerX,
    setIsPlayerX,
    gameState,
    setGameState,
    isFinished,
    winningCombination
  } = useGameContextProvider()
  const tile = tileId as keyof GameState
  const winningTile =
    winningCombination && winningCombination.includes(tile) && isFinished
  const handleTileClick = () => {
    if (letter || isFinished) return // tile has already been selected

    const selection = isPlayerX ? 'x' : 'o'

    setLetter(selection)
    setIsPlayerX(!isPlayerX)
    setGameState({
      ...gameState,
      [tileId]: isPlayerX ? 'x' : 'o'
    })
  }

  return (
    <div
      onClick={handleTileClick}
      className={`${
        winningTile ? 'bg-green-200' : ''
      } flex justify-center items-center p-4 h-24 w-24 border-black border-2 text-4xl capitalize cursor-pointer`}
    >
      {letter}
    </div>
  )
}
