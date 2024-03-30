'use client'

import Grid from '@/components/grid'
import RestartButton from '@/components/restart-button'
import { useGameContextProvider } from '@/context/game-context-provider'
import { useEffect, useState } from 'react'
import { socket } from '../socket'

export default function Home() {
  const { message } = useGameContextProvider()

  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState('N/A')
  const [playerNumber, setPlayerNumber] = useState<string | null>(null)
  const [opponentNumber, setOpponentNumber] = useState<string | null>(null)
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
    function onPlayerNumberSelect(player: string, hasOpponent: boolean) {
      setPlayerNumber(player)

      if (hasOpponent) {
        setOpponentNumber(player === '1' ? '0' : '1')
      }
    }

    function onPlayerConnectSelect(opponent: string) {
      if (gameFull) return
      setOpponentNumber(opponent)
    }

    function onPlayerDisconnectSelect(opponent: string) {
      setOpponentNumber(null)
    }

    function onGameFull() {
      setGameFull(true)
    }

    socket.on('player-number', onPlayerNumberSelect)
    socket.on('player-connect', onPlayerConnectSelect)
    socket.on('player-disconnect', onPlayerDisconnectSelect)
    socket.on('game-full', onGameFull)

    return () => {
      socket.off('player-number', onPlayerNumberSelect)
      socket.off('player-connect', onPlayerConnectSelect)
      socket.off('player-disconnect', onPlayerDisconnectSelect)
      socket.off('game-full', onGameFull)
    }
  }, [gameFull])

  return (
    <main className="flex flex-1 justify-center items-center">
      {/* <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Transport: {transport}</p> */}
      <div>
        <RestartButton />
        <div className="font-semibold">
          {gameFull ? <div>Game is full.</div> : null}
          {playerNumber ? (
            <>
              Player {playerNumber} (You): X <br />
            </>
          ) : null}
          {opponentNumber ? <>Player {opponentNumber} (Opponent): O</> : null}
        </div>
        <div className="flex items-center justify-center">
          <Grid />
        </div>
        <div>{message}</div>
      </div>
    </main>
  )
}
