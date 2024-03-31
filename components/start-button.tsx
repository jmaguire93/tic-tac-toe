'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import { socket } from '@/socket'
import React from 'react'

export default function StartButton() {
  const { readyToStart, setHasStarted } = useGameContextProvider()

  const handleStartClick = () => {
    setHasStarted(true)

    // send socket event to let other players know the game has started
    socket.emit('start-game')
  }

  return (
    <div className="m-4 text-center">
      <button
        disabled={!readyToStart}
        onClick={handleStartClick}
        className={`bg-green-700 ${
          !readyToStart ? 'opacity-70' : ''
        } text-white rounded py-2 px-4`}
      >
        Start
      </button>
    </div>
  )
}
