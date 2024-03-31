'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import React from 'react'

export default function RestartButton() {
  const { hasFinished } = useGameContextProvider()

  return (
    <div className="m-4 text-center">
      <button
        disabled={!hasFinished}
        onClick={() => window.location.reload()}
        className="bg-green-700 text-white rounded py-2 px-4"
      >
        Restart
      </button>
    </div>
  )
}
