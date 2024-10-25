module.exports = () => {
  let expressClient = null
  const expressHost = 'localhost'
  const expressPort = 1234

  let metaClient = null
  const metaHost = 'localhost'
  const metaPort = 2234

  let eventClient = null
  const eventHost = 'localhost'
  const eventPort = 3234

  function init() {
    console.log(`worker-msgsender init start`)
    expressClient = global.spiderman.udp.create()
    metaClient = global.spiderman.udp.create()
    eventClient = global.spiderman.udp.create()
    console.log(`worker-msgsender init end`)
  }

  function send(data) {
    expressClient.send(
      data,
      0,
      data.length,
      expressPort,
      expressHost,
      (err, bytes) => {
        console.log(
          `worker-msgsender to ${expressHost} ${expressPort}`,
          err,
          bytes,
        )
      },
    )

    metaClient.send(data, 0, data.length, metaPort, metaHost, (err, bytes) => {
      console.log(`worker-msgsender to ${metaHost} ${metaPort}`, err, bytes)
    })

    eventClient.send(
      data,
      0,
      data.length,
      eventPort,
      eventHost,
      (err, bytes) => {
        console.log(`worker-msgsender to ${eventHost} ${eventPort}`, err, bytes)
      },
    )
  }

  return {
    init,
    send,
  }
}
