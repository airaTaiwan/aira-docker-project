const net = require('node:net')

module.exports = () => {
  function connect({
    host,
    port,
    onConnect = () => {},
    onData = () => {},
    onClose = () => {},
    onError = () => {},
  }) {
    // 建立 TCP 連線
    const client = new net.Socket()

    // 連接到遠端伺服器
    client.connect(port, host, () => {
      console.log(`TCP connected ${host}:${port}`)
      onConnect(client)
    })

    // 監聽從伺服器接收的資料
    client.on('data', (data) => {
      console.log('TCP response')
      onData(client, data)
    })

    // 監聽連線關閉事件
    client.on('close', () => {
      console.log('TCP closed', port, host)
      onClose(client)
    })

    // 監聽連線錯誤事件
    client.on('error', (err) => {
      console.error('TCP error', err)
      onError(client)
    })

    return client
  }

  return {
    connect,
  }
}
