'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import { socket } from '@/socket'
import React from 'react'

export default function StartButton() {
  const { readyToStart, setHasStarted, playerId, currentId } =
    useGameContextProvider()

  const handleStartClick = () => {
    setHasStarted(true)

    // send socket event to let other players know the game has started
    socket.emit('startGame')
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
        Let&apos;s go!
      </button>
    </div>
  )
}
