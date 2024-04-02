'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import { socket } from '@/socket'
import React from 'react'

export default function RestartButton() {
  const { hasFinished } = useGameContextProvider()

  const handleRestartClick = () => {
    // send socket event to let other players know the game has started
    socket.emit('restartGame')
  }

  return (
    <div className="m-4 text-center">
      <button
        disabled={!hasFinished}
        onClick={handleRestartClick}
        className={`bg-green-700 ${
          !hasFinished ? 'opacity-70' : ''
        } text-white rounded py-2 px-4`}
      >
        Rematch
      </button>
    </div>
  )
}
