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
    hasFinished,
    winningCombination,
    currentTile,
    setCurrentTile,
    hasStarted,
    playerId,
    currentId,
    setCurrentId
  } = useGameContextProvider()
  const tile = tileId as keyof GameState
  const winningTile =
    winningCombination && winningCombination.includes(tile) && hasFinished
  const handleTileClick = () => {
    if (letter || !hasStarted || hasFinished || currentId !== playerId) return // tile has already been selected

    const selection = isPlayerX ? 'x' : 'o'
    setCurrentTile(tileId)

    // Emit an event to the server to update currentTile
    socket.emit('updateCurrentTile', tileId)
    socket.emit('tileSelect', selection)
  }
  useEffect(() => {
    const handleTileSelect = (data: Letter) => {
      if (tileId === currentTile) {
        const updatedGameState = {
          ...gameState,
          [tileId]: isPlayerX ? 'x' : 'o'
        }

        setLetter(data)
        setIsPlayerX(!isPlayerX)
        setCurrentId(isPlayerX ? 2 : 1)
        setGameState(updatedGameState)
        // save updated gamestate on the server
        socket.emit('on-player-move', updatedGameState, !isPlayerX)
      }
    }

    // ensure existing letters are persisted for each tile
    setLetter(gameState[tileId as keyof GameState])

    socket.on('tileSelect', handleTileSelect)

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off('tileSelect', handleTileSelect)
    }
  }, [
    currentTile,
    gameState,
    isPlayerX,
    setCurrentId,
    setGameState,
    setIsPlayerX,
    tileId
  ])

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
      className={`${winningTile ? 'bg-green-200' : ''} ${
        !hasFinished ? 'hover:bg-gray-100' : ''
      } flex justify-center items-center p-4 h-24 w-24 border-black border-4 text-4xl capitalize cursor-pointer`}
    >
      {letter}
    </div>
  )
}
