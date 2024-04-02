'use client'

import { io } from 'socket.io-client'
import { Socket } from 'socket.io-client'

export const socket: Socket = io()
