const dgram = require('node:dgram')

module.exports = () => {
  function createServer({
    host,
    port,
    onReadly = () => {},
    onConnect = () => {},
    onData = () => {},
    onClose = () => {},
    onError = () => {},
  }) {
    // 建立 server
    const server = dgram.createSocket('udp4')

    server.on('connect', () => {
      console.error('udpserver connect')

      onConnect(server)
    })

    server.on('error', (err) => {
      console.error(`udpserver error: ${err}`)

      onError(server, err)
      server.close()
    })

    server.on('message', (data, info) => {
      // console.error('udpserver message: ' + data);

      onData(server, data)
    })

    server.on('close', () => {
      console.info('server onClose')

      onClose(server)
    })

    server.on('listening', () => {
      const address = server.address()
      console.log(`server listening ${address.address}:${address.port}`)

      server.setRecvBufferSize(100000000) // 100mb

      onReadly(server)
    })

    server.bind(port, host)
    console.log('udpserver createServer', host, port)

    return server
  }

  return {
    createServer,
  }
}
