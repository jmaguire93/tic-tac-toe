import Home from '@/app/page'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { useSocketContextProvider } from '@/context/socket-context-provider'
import { useGameContextProvider } from '@/context/game-context-provider'

const mockGameData = {
  isPlayerX: true,
  setIsPlayerX: jest.fn(),
  message: '',
  setMessage: jest.fn(),
  readyToStart: false,
  setReadyToStart: jest.fn(),
  hasStarted: false,
  setHasStarted: jest.fn(),
  playerId: null,
  setPlayerId: jest.fn(),
  opponentId: null,
  setOpponentId: jest.fn(),
  currentId: null,
  setCurrentId: jest.fn(),
  gameState: {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: ''
  },
  setGameState: jest.fn(),
  hasFinished: false,
  setHasFinished: jest.fn(),
  winningCombinations: null,
  setWinningCombination: jest.fn(),
  gameFull: false,
  setGameFull: jest.fn()
}

// Mocking the useGameContextProvider and useSocketContextProvider
jest.mock('../context/game-context-provider', () => {
  const originalModule = jest.requireActual('../context/game-context-provider')
  return {
    ...originalModule,
    useGameContextProvider: jest.fn(() => mockGameData)
  }
})

jest.mock('../context/socket-context-provider', () => {
  const originalModule = jest.requireActual(
    '../context/socket-context-provider'
  )
  return {
    ...originalModule,
    useSocketContextProvider: jest.fn(() => ({ isConnected: true }))
  }
})

describe('Home', () => {
  const socketProvider = useSocketContextProvider as jest.Mock
  const gameProvider = useGameContextProvider as jest.Mock

  it('renders a heading', () => {
    render(<Home />)

    expect(screen.getByText(/Status:/i)).toBeInTheDocument()
  })

  it('displays "Connecting..." when not connected', () => {
    // const socketProvider = useSocketContextProvider as jest.Mock
    socketProvider.mockReturnValue({
      isConnected: false
    })

    render(<Home />)
    expect(screen.getByText(/Connecting.../i)).toBeInTheDocument()
  })

  it('displays "Game is full." when game is full', () => {
    socketProvider.mockReturnValue({
      isConnected: true
    })
    gameProvider.mockReturnValue({
      ...mockGameData,
      gameFull: true
    })
    render(<Home />)
    expect(screen.getByText(/Game is full./i)).toBeInTheDocument()
  })

  it('displays "Waiting for opponent..." when opponent is not present and game is not full', () => {
    gameProvider.mockReturnValue({
      ...mockGameData,
      playerId: 1,
      opponentId: null
    })

    render(<Home />)
    expect(screen.getByText(/Waiting for opponent.../i)).toBeInTheDocument()
  })

  it('displays correct player information', () => {
    gameProvider.mockReturnValue({
      ...mockGameData,
      playerId: 1,
      opponentId: 2
    })

    render(<Home />)
    expect(screen.getByText(/Player 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Player 2/i)).toBeInTheDocument()
  })
})
