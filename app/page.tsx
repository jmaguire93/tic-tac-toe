'use client'

import Grid from '@/components/grid'
import RestartButton from '@/components/restart-button'
import { useGameContextProvider } from '@/context/game-context-provider'

export default function Home() {
  const { message } = useGameContextProvider()

  return (
    <main className="flex flex-1 justify-center items-center">
      <div>
        <RestartButton />
        <div className="font-semibold">
          Player 1: X <br /> Player 2: O
        </div>
        <div className="flex items-center justify-center">
          <Grid />
        </div>
        <div>{message}</div>
      </div>
    </main>
  )
}
