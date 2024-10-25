const { uuid: uuidv4 } = require('uuidv4')
const WebSocket = require('ws')

module.exports = () => {
  function create({ server, path, noServer } = {}, eventEmitter = undefined) {
    // if (!server || !path) throw new Error('server and path are required');

    const socketServer = new WebSocket.Server({
      server,
      path,
      noServer,
      maxPayload: 1000 * 1024 * 1024,
    })
    socketServer.connectedClients = new Map()

    socketServer.on('connection', (ws, req) => {
      const id = uuidv4()

      const ip = ws._socket.remoteAddress.trim().toLowerCase()
      const url = req.url.trim().toLowerCase()

      console.log('New connection from ws remoteAddress', id, ip, url)
      socketServer.connectedClients.set(id, ws)
      if (eventEmitter)
        eventEmitter.emit('connect', { socket: ws, url })

      ws.on('message', (message) => {
        const client = socketServer.connectedClients.get(id)

        console.log('message remoteAddress', client._socket.remoteAddress)
        console.log('message', message)

        ws.send(`response: ${message}`)

        return false
      })

      ws.on('error', (error) => {
        const client = socketServer.connectedClients.get(id)

        console.log('error remoteAddress', id, ip, url, error)
      })

      ws.on('close', (code, reason) => {
        const client = socketServer.connectedClients.get(id)
        console.log('close remoteAddress', id, ip, url, code, reason)
        socketServer.connectedClients.delete(id)
      })

      ws.send(JSON.stringify({ id, remoteAddress: ip, path: url }))
    })

    return socketServer
  }

  function broadcastMessage({ socketServer, message }) {
    if (socketServer) {
      socketServer.connectedClients.forEach((value) => {
        // console.log('broadcastMessage', value._socket.remoteAddress, message.substr(0, 100));
        value.send(message)
      })
    }
  }

  function connect({
    url,
    onOpen = () => {},
    onMessage = () => {},
    onClose = () => {},
    onError = () => {},
  }) {
    // 建立 WebSocket 連線
    const client = new WebSocket(url)

    // 監聽連線成功事件
    client.on('open', () => {
      console.log(`WebSocket connected ${url}`)
      onOpen(client)
    })

    // 監聽來自 WebSocket 伺服器的訊息
    client.on('message', (data) => {
      console.log('WebSocket response')
      onMessage(client, data)
    })

    // 監聽連線關閉事件
    client.on('close', () => {
      console.log('WebSocket closed')
      onClose(client)
    })

    // 監聽連線錯誤事件
    client.on('error', (err) => {
      console.error('WebSocket error', err)
      onError(client)
    })

    return client
  }

  return {
    create,
    broadcastMessage,
    connect,
  }
}
