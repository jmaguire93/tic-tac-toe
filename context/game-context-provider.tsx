'use client'

import React, { createContext, useContext, useState } from 'react'

type GameContextType = {
  isPlayerX: boolean
  setIsPlayerX: React.Dispatch<React.SetStateAction<boolean>>
}

type GameContextProviderProps = {
  children: React.ReactNode
}

const GameContext = createContext<GameContextType | null>(null)

export default function GameContextProvider({
  children
}: GameContextProviderProps) {
  const [isPlayerX, setIsPlayerX] = useState<boolean>(true)

  return (
    <GameContext.Provider
      value={{
        isPlayerX,
        setIsPlayerX
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContextProvider() {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error(
      'useGameContextProvider must be used within the GameContextProvider'
    )
  }

  return context
}
