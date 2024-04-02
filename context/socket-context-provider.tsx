'use client'

import { socket } from '@/socket'
import React, { createContext, useContext, useEffect, useState } from 'react'

type SocketContextType = {
  isConnected: boolean
  transport: string
}

type SocketContextProviderProps = {
  children: React.ReactNode
}

const SocketContext = createContext<SocketContextType | null>(null)

export default function SocketContextProvider({
  children
}: SocketContextProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState('N/A')

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

  return (
    <SocketContext.Provider value={{ isConnected, transport }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContextProvider() {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error(
      'useSocketContextProvider must be used within the SocketContextProvider'
    )
  }

  return context
}
