const EventEmitter = require('node:events')
const dna = require('./dna')

// 指定要列出檔案的資料夾路徑
module.exports = {
  init: () => {
    const abilities = {
      _: require('lodash'),
      dayjs: require('./dayjs')(),
      calculate: require('./calculate')(),
      express: require('./express')(),
      // facefeature: require('./facefeature')(),
      image: require('./image')(),
      parse: require('./parse')(),
      query: require('./query')(),
      request: require('./request')(),
      socket: require('./socket')(),
      mongo: require('./mongo')(),
      mqttclient: require('./mqttclient')(),
      tcpclient: require('./tcpclient')(),
      tcpserver: require('./tcpserver')(),

      udpserver: require('./udpserver')(),
      udp: require('./udp')(),

      // udpclient: require('./udpclient')(),
      systemlog: require('./systemlog')(),
      token: require('./token')(),
      validate: require('./validate')(),
      // line: require('./line')(),
      mailer: require('./mailer')(),
      encryption: require('./encryption')(),

      nxdriver: require('./nxdriver')(),

      defaultdata: require('./defaultdata')(),
      db: require('./db')(dna.db),
      notificationPusher: require('./socket')(),
      eventEmitter: new EventEmitter(),
    }

    return abilities
  },
}
