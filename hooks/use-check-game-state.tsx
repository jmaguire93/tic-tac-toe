'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import { Combination } from '@/types'
import { checkMatch, winningCombinations } from '@/utils'
import { useCallback, useEffect } from 'react'

export default function useOnSelection() {
  const {
    isPlayerX,
    gameState,
    setHasFinished,
    setMessage,
    setWinningCombination
  } = useGameContextProvider()

  const checkGameState = useCallback(() => {
    const checkCombinationMatch = (array: Combination) => {
      const [a, b, c] = array
      return checkMatch(gameState[a], gameState[b], gameState[c])
    }

    // Loop through possible winning combinations to see if there is a match
    for (const combination of winningCombinations()) {
      if (checkCombinationMatch(combination)) {
        setWinningCombination(combination)
        setHasFinished(true)
        setMessage(`${isPlayerX ? 'Player 2' : 'Player 1'} wins!`)
        return
      }
    }

    // Check if there are still any empty tiles left
    if (!Object.values(gameState).includes('')) {
      setHasFinished(true)
      setMessage(`It's a draw! Try again for victory!`)
      return
    }

    setHasFinished(false)
    setMessage('')
  }, [gameState, isPlayerX, setHasFinished, setMessage, setWinningCombination])

  useEffect(() => {
    checkGameState()
  }, [checkGameState, gameState])
}
