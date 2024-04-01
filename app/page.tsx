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
    setGameState
  } = useGameContextProvider()

  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState('N/A')
  const [gameFull, setGameFull] = useState<boolean>(false)

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      setIsConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name)
      })
    }

    function onDisconnect() {
      setIsConnected(false)
      setTransport('N/A')
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  useEffect(() => {
    function onPlayerNumberSelect(player: number, hasOpponent: boolean) {
      setPlayerId(player)

      setCurrentId(isPlayerX ? 1 : 2)

      // if first player, make the current player when they connect
      if (player === 1) {
        setCurrentId(player)
      }

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

    function onGameRestarted() {
      window.location.reload()
    }

    function onGameFull() {
      setGameFull(true)
    }

    function onRestoreGameState(
      restoredGameState: GameState,
      restoredHasStarted: boolean,
      restoredIsPlayerX: boolean,
      restoredCurrentId: number
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

      if (currentId !== restoredCurrentId) {
        setCurrentId(restoredCurrentId)
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
    setHasStarted,
    setOpponentId,
    setPlayerId,
    setReadyToStart
  ])

  return (
    <main className="flex flex-1 justify-center items-center">
      {/* <p>Transport: {transport}</p> */}
      <div>
        {/* <p className="text-center capitalize">
          Status: {isConnected ? 'connected' : 'disconnected'}
        </p> */}
        {hasStarted ? (
          <>
            <RestartButton />
            <div className="text-center">
              {currentId === playerId ? (
                <div className="font-semibold">Your turn!</div>
              ) : (
                <div>{`Opponent's turn!`}</div>
              )}
            </div>
          </>
        ) : (
          <StartButton />
        )}
        <div className="text-center">
          {gameFull ? <div>Game is full.</div> : null}
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
              <>Waiting for opponent...</>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Grid />
        </div>
        <div>{message}</div>
      </div>
    </main>
  )
}
