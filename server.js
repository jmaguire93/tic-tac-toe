const { createServer } = require('node:http')
const next = require('next')
const { Server } = require('socket.io')
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

// game starting defaults
let gameState = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: ''
}
let hasStarted = false
let currentId = null
let isPlayerX = true

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer)
  const connections = [null, null]

  io.on('connection', (socket) => {
    // Find an available player number
    let playerIndex = -1

    for (var i in connections) {
      if (connections[i] === null) {
        playerIndex = parseInt(i)
        break
      }
    }

    // Alert any other players trying to join that the game is full
    if (playerIndex === -1) {
      socket.emit('game-full')
      return
    }

    console.log(`Player ${playerIndex} Connected`)

    const hasOpponent = playerIndex === 0 ? !!connections[1] : !!connections[0]

    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex + 1, hasOpponent, isPlayerX)
    // Ensure player has the latest game state stored on the server
    socket.emit(
      'restore-game-state',
      gameState,
      hasStarted,
      isPlayerX,
      currentId
    )

    connections[playerIndex] = socket

    // Tell everyone else what player number just connected
    socket.broadcast.emit('player-connect', playerIndex + 1, hasOpponent)

    socket.on('start-game', () => {
      // Tell the opponent the game has started
      socket.broadcast.emit('game-started')
      hasStarted = true
    })

    // Listen for the event to update and store the game state on the server
    socket.on('on-player-move', (updatedGameState, updatedIsPlayerX) => {
      gameState = updatedGameState
      currentId = updatedIsPlayerX ? 1 : 2
      isPlayerX = updatedIsPlayerX
    })

    socket.on('restart-game', () => {
      gameState = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      }
      hasStarted = false
      currentId = null
      isPlayerX = true

      io.emit('game-restarted', gameState)
    })

    socket.on('updateCurrentTile', (tileId) => {
      // Broadcast the updated currentTile to all connected clients
      socket.broadcast.emit('currentTileUpdate', tileId)
    })

    socket.on('tileSelect', (value) => {
      io.emit('tileSelect', value)
    })

    socket.on('disconnect', function () {
      console.log(`Player ${playerIndex} Disconnected`)
      connections[playerIndex] = null

      // Tell everyone else which player has disconnected
      socket.broadcast.emit('player-disconnect')
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
