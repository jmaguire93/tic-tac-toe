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
    setWinningCombination
  } = useGameContextProvider()

  const { isConnected } = useSocketContextProvider()
  const [gameFull, setGameFull] = useState<boolean>(false)

  useEffect(() => {
    function onPlayerNumberSelect(
      player: number,
      hasOpponent: boolean,
      restoredIsPlayerX: boolean
    ) {
      setPlayerId(player)
      setCurrentId(restoredIsPlayerX ? 1 : 2)

      if (hasOpponent) {
        setOpponentId(player === 1 ? 2 : 1)
      }

      setReadyToStart(hasOpponent)
    }

    function onPlayerConnectSelect(opponent: number, hasOpponent: boolean) {
      if (gameFull) return
      setOpponentId(opponent)
      setReadyToStart(hasOpponent)
    }

    function onPlayerDisconnectSelect() {
      setOpponentId(null)
      setReadyToStart(false)
    }

    function onGameStarted() {
      setHasStarted(true)
    }

    function onGameRestarted(initialGameState: GameState) {
      setGameState(initialGameState)
      setHasStarted(false)
      setHasFinished(false)
      setCurrentId(1)
      setIsPlayerX(true)
      setWinningCombination(null)
    }

    function onGameFull() {
      setGameFull(true)
    }

    function onRestoreGameState(
      restoredGameState: GameState,
      restoredHasStarted: boolean,
      restoredIsPlayerX: boolean
    ) {
      if (!compareObjects(restoredGameState, gameState)) {
        setGameState(restoredGameState)
      }

      if (hasStarted !== restoredHasStarted) {
        setHasStarted(restoredHasStarted)
      }

      if (isPlayerX !== restoredIsPlayerX) {
        setIsPlayerX(restoredIsPlayerX)
      }
    }

    socket.on('player-number', onPlayerNumberSelect)
    socket.on('player-connect', onPlayerConnectSelect)
    socket.on('player-disconnect', onPlayerDisconnectSelect)
    socket.on('game-started', onGameStarted)
    socket.on('game-restarted', onGameRestarted)
    socket.on('game-full', onGameFull)
    socket.on('restore-game-state', onRestoreGameState)

    return () => {
      socket.off('player-number', onPlayerNumberSelect)
      socket.off('player-connect', onPlayerConnectSelect)
      socket.off('player-disconnect', onPlayerDisconnectSelect)
      socket.off('game-started', onGameStarted)
      socket.off('game-restarted', onGameRestarted)
      socket.off('game-full', onGameFull)
      socket.off('restore-game-state', onRestoreGameState)
    }
  }, [
    currentId,
    gameFull,
    gameState,
    hasStarted,
    isPlayerX,
    setCurrentId,
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
