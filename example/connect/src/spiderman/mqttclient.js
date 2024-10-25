const mqtt = require('mqtt')

module.exports = () => {
  let client = null

  function subscribe(topic) {
    if (client) {
      client.subscribe(topic, (err) => {
        if (!err) {
          // console.error('subscribe onError', err);
          onError(client, err)
        }
      })
    }
  }

  function connect({
    host,
    port,
    user,
    pass,
    onConnect = () => {},
    onData = () => {},
    onClose = () => {},
    onError = () => {},
  }) {
    // 建立 MQTT 連線
    client = mqtt.connect(`mqtt://${host}:${port}`, {
      reconnectPeriod: 1000, // Disable auto reconnect by setting to 0.
      connectTimeout: 30 * 1000,
      username: user,
      password: pass,
    })

    // 連接到遠端伺服器
    client.on('connect', (connack) => {
      // console.log('MQTT onConnect');

      onConnect(client, connack)
    })

    // 監聽從伺服器接收的資料
    client.on('message', (topic, message) => {
      // console.log('MQTT onMessage');
      onData(client, topic, message)
    })

    // 監聽連線關閉事件
    client.on('close', () => {
      // console.log('MQTT onClose', port, host);
      onClose(client)
    })

    // 監聽連線錯誤事件
    client.on('error', (err) => {
      // console.error('MQTT onError', err);
      onError(client, err)
    })

    return client
  }

  function disconnnect() {
    // console.error('MQTT disconnnect');

    if (client)
      client.end()
  }

  return {
    connect,
    disconnnect,
    subscribe,
  }
}
