'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import { socket } from '@/socket'
import { GameState, Letter } from '@/types'
import React, { useEffect, useState } from 'react'

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
    winningCombination,
    currentTile,
    setCurrentTile
  } = useGameContextProvider()
  const tile = tileId as keyof GameState
  const winningTile =
    winningCombination && winningCombination.includes(tile) && isFinished
  const handleTileClick = () => {
    if (letter || isFinished) return // tile has already been selected

    const selection = isPlayerX ? 'x' : 'o'
    setCurrentTile(tileId)

    // Emit an event to the server to update currentTile
    socket.emit('updateCurrentTile', tileId)
    socket.emit('tileSelect', selection)
  }
  useEffect(() => {
    const handleTileSelect = (data: Letter) => {
      if (tileId === currentTile) {
        setLetter(data)
        setIsPlayerX(!isPlayerX)
        setGameState({
          ...gameState,
          [tileId]: isPlayerX ? 'x' : 'o'
        })
      }
    }

    socket.on('tileSelect', handleTileSelect)

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off('tileSelect', handleTileSelect)
    }
  }, [currentTile, gameState, isPlayerX, setGameState, setIsPlayerX, tileId])

  useEffect(() => {
    socket.on('currentTileUpdate', (updatedTileId) => {
      setCurrentTile(updatedTileId)
    })

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off('currentTileUpdate')
    }
  }, [setCurrentTile])

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
