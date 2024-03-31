const { createServer } = require('node:http')
const next = require('next')
const { Server } = require('socket.io')
const { connect } = require('http2')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer)
  const connections = [null, null]

  io.on('connection', (socket) => {
    // Find an available player number
    let playerIndex = -1

    for (var i in connections) {
      if (connections[i] === null) {
        playerIndex = i
        break
      }
    }

    // Alert any other players trying to join that the game is full
    if (playerIndex === -1) {
      socket.emit('game-full')
      return
    }

    console.log(`Player ${playerIndex} Connected`)

    const hasOpponent =
      playerIndex === '0' ? !!connections[1] : !!connections[0]

    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex, hasOpponent)

    connections[playerIndex] = socket

    // Tell everyone else what player number just connected
    socket.broadcast.emit('player-connect', playerIndex, hasOpponent)

    socket.on('start-game', () => {
      // Tell the opponent the game has started
      socket.broadcast.emit('game-started')
    })

    socket.on('updateCurrentTile', (tileId) => {
      // Broadcast the updated currentTile to all connected clients
      io.emit('currentTileUpdate', tileId)
    })

    socket.on('tileSelect', (value) => {
      io.emit('tileSelect', value)
    })

    socket.on('disconnect', function () {
      console.log(`Player ${playerIndex} Disconnected`)
      connections[playerIndex] = null

      // tell everyone else which player has disconnected
      socket.broadcast.emit('player-disconnect', playerIndex)
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
