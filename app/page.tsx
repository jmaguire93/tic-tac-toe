'use client'

import Grid from '@/components/grid'
import RestartButton from '@/components/restart-button'
import { useGameContextProvider } from '@/context/game-context-provider'
import { useEffect, useState } from 'react'
import { socket } from '../socket'
import StartButton from '@/components/start-button'
import React from 'react'
import { GameState } from '@/types'
import { compareObjects } from '@/utils'
import { useSocketContextProvider } from '@/context/socket-context-provider'

export default function Home() {
  const {
    isPlayerX,
    setIsPlayerX,
    message,
    hasStarted,
    setReadyToStart,
    setHasStarted,
    playerId,
    setPlayerId,
    opponentId,
    setOpponentId,
    currentId,
    setCurrentId,
    gameState,
    setGameState,
    hasFinished,
    setHasFinished,
    setWinningCombination,
    gameFull,
    setGameFull
  } = useGameContextProvider()

  const { isConnected } = useSocketContextProvider()

  useEffect(() => {
    const handlePlayerEvents = (
      player: number,
      hasOpponent: boolean,
      restoredIsPlayerX: boolean
    ) => {
      setPlayerId(player)
      setCurrentId(restoredIsPlayerX ? 1 : 2)

      if (isPlayerX !== restoredIsPlayerX) {
        setIsPlayerX(restoredIsPlayerX)
      }

      if (hasOpponent) {
        setOpponentId(player === 1 ? 2 : 1)
      }

      setReadyToStart(hasOpponent)
    }

    const handlePlayerConnect = (opponent: number, hasOpponent: boolean) => {
      if (gameFull) return
      setOpponentId(opponent)
      setReadyToStart(hasOpponent)
    }

    const handlePlayerDisconnect = () => {
      setOpponentId(null)
      setReadyToStart(false)
    }

    const handleGameStarted = () => {
      setHasStarted(true)
    }

    const handleGameRestarted = (initialGameState: GameState) => {
      setGameState(initialGameState)
      setHasStarted(false)
      setHasFinished(false)
      setCurrentId(1)
      setIsPlayerX(true)
      setWinningCombination(null)
    }

    const handleGameFull = () => {
      setGameFull(true)
    }

    const handleRestoreGameState = (
      restoredGameState: GameState,
      restoredHasStarted: boolean
    ) => {
      if (!compareObjects(restoredGameState, gameState)) {
        setGameState(restoredGameState)
      }

      if (hasStarted !== restoredHasStarted) {
        setHasStarted(restoredHasStarted)
      }
    }

    socket.on('playerEvents', handlePlayerEvents)
    socket.on('playerConnect', handlePlayerConnect)
    socket.on('playerDisconnect', handlePlayerDisconnect)
    socket.on('gameStarted', handleGameStarted)
    socket.on('gameRestarted', handleGameRestarted)
    socket.on('gameFull', handleGameFull)
    socket.on('restoreGameState', handleRestoreGameState)

    return () => {
      socket.off('playerEvents', handlePlayerEvents)
      socket.off('playerConnect', handlePlayerConnect)
      socket.off('playerDisconnect', handlePlayerDisconnect)
      socket.off('gameStarted', handleGameStarted)
      socket.off('gameRestarted', handleGameRestarted)
      socket.off('gameFull', handleGameFull)
      socket.off('restoreGameState', handleRestoreGameState)
    }
  }, [
    currentId,
    gameFull,
    gameState,
    hasStarted,
    isPlayerX,
    setCurrentId,
    setGameFull,
    setGameState,
    setHasFinished,
    setHasStarted,
    setIsPlayerX,
    setOpponentId,
    setPlayerId,
    setReadyToStart,
    setWinningCombination
  ])

  return (
    <>
      <p className="text-sm text-right capitalize px-2">
        Status: {isConnected ? 'connected' : 'disconnected'}
      </p>
      <main className="flex flex-1 justify-center items-center">
        <div className="relative">
          {hasStarted && !gameFull ? (
            <>
              <RestartButton />
              {!hasFinished ? (
                <div className="text-center font-semibold">
                  {currentId === playerId ? (
                    <div>Your turn!</div>
                  ) : (
                    <div>{`Opponent's turn!`}</div>
                  )}
                </div>
              ) : null}
            </>
          ) : (
            <StartButton />
          )}
          <div className="text-center">
            {gameFull ? <div>Game is full.</div> : null}
            {isConnected ? (
              <div className="flex justify-between text-sm">
                {playerId ? (
                  <div
                    className={`${
                      currentId === playerId ? 'font-bold' : ''
                    } inline`}
                  >
                    Player {playerId} ({playerId === 1 ? 'X' : 'O'})
                  </div>
                ) : null}
                {opponentId ? (
                  <div
                    className={`${
                      currentId !== playerId ? 'font-bold' : ''
                    } inline`}
                  >
                    Player {opponentId} ({opponentId === 1 ? 'X' : 'O'})
                  </div>
                ) : (
                  <>{!gameFull ? 'Waiting for opponent...' : null}</>
                )}
              </div>
            ) : (
              <div className="text-sm">Connecting...</div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <Grid />
          </div>
          <div className="absolute left-0 right-0 mx-auto text-center">
            {message}
          </div>
        </div>
      </main>
    </>
  )
}
