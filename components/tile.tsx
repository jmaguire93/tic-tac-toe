'use client'

import { useGameContextProvider } from '@/context/game-context-provider'
import React, { useState } from 'react'

type Letter = 'x' | 'o' | ''

export default function Tile() {
  const [letter, setLetter] = useState<Letter>('')

  const { isPlayerX, setIsPlayerX } = useGameContextProvider()

  const handleSelection = () => {
    if (letter) return // tile has already been selected

    const selection = isPlayerX ? 'x' : 'o'

    setLetter(selection)
    setIsPlayerX(!isPlayerX)
  }

  return (
    <div
      onClick={handleSelection}
      className="flex justify-center items-center p-4 h-24 w-24 border-black border-2 text-4xl capitalize cursor-pointer"
    >
      {letter}
    </div>
  )
}
