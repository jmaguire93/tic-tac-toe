'use client'

import { Combination, GameState } from '@/types'
import React, { createContext, useContext, useState } from 'react'

type GameContextType = {
  isPlayerX: boolean
  setIsPlayerX: React.Dispatch<React.SetStateAction<boolean>>
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  isFinished: boolean
  setIsFinished: React.Dispatch<React.SetStateAction<boolean>>
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  winningCombination: Combination | null
  setWinningCombination: React.Dispatch<
    React.SetStateAction<Combination | null>
  >
  currentTile: number | null
  setCurrentTile: React.Dispatch<React.SetStateAction<number | null>>
}

type GameContextProviderProps = {
  children: React.ReactNode
}

const GameContext = createContext<GameContextType | null>(null)

export default function GameContextProvider({
  children
}: GameContextProviderProps) {
  const [isPlayerX, setIsPlayerX] = useState<boolean>(true)
  const [gameState, setGameState] = useState<GameState>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: ''
  })
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [winningCombination, setWinningCombination] =
    useState<Combination | null>(null)
  const [currentTile, setCurrentTile] = useState<number | null>(null)

  return (
    <GameContext.Provider
      value={{
        isPlayerX,
        setIsPlayerX,
        gameState,
        setGameState,
        isFinished,
        setIsFinished,
        message,
        setMessage,
        winningCombination,
        setWinningCombination,
        currentTile,
        setCurrentTile
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
