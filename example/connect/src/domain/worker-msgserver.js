module.exports = () => {
  let server = null
  const metaHost = '0.0.0.0'
  const metaPort = 1234

  function init() {
    console.log('worker-msgserver init start')

    server = global.spiderman.udpserver.createServer({
      host: metaHost,
      port: metaPort,
      onReadly: (server) => {
        console.log('worker-msgserver onReadly')
      },
      onConnect: (server) => {
        console.log('worker-msgserver onConnect')
      },
      onData: (socket, data) => {
        // console.log("worker-msgserver onData");

        try {
          global.spiderman.socket.broadcastMessage({
            socketServer: global.spiderman.server.wsDeviceStatus,
            message: data.toString(),
          })
        }
        catch (ex) {
          console.log('worker-msgserver onData', ex)
        }
      },

      onClose: () => {
        console.log('worker-msgserver onClose')
      },
      onError: () => {
        console.log('worker-msgserver onError')
      },
    })

    console.log('worker-msgserver init end')
  }

  return {
    init,
  }
}
