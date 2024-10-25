const net = require('node:net')

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
    const server = new net.createServer((socket) => {
      socket.pipe(socket)

      socket.on('data', (data) => {
        // console.info('Socket onDate', data);

        onData(socket, data)
      })

      socket.on('close', () => {
        // console.info('Socket onClose');

        onClose(socket)
      })

      socket.on('error', (err) => {
        // console.error('Socket error: ' + err);
        // console.error(new Error().stack);

        onError(socket, err)
      })
    })

    server.listen(port, host, () => {
      // console.log(`TCP Server start @${port}`);

      onReadly(server)
    })

    server.on('connection', () => {
      // console.log('server端：收到 client 端連線請求，並通知 client 端可以開始傳送資料')

      onConnect(server)
    })

    return server
  }

  return {
    createServer,
  }
}
