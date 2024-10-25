module.exports = () => {
  // let allDevices = [];

  function init() {
    // global.spiderman.systemlog.writeInfo('domain worker-iobox init');

    // allDevices.forEach(({ conn }) => {
    //   conn.end();
    // });
    // allDevices = [];

    setTimeout(() => {
      connectDevices()
    }, 1000)
  }

  function connectDevices() {
    // const devices = [
    //   {
    //     host: "192.168.10.75",
    //     port: 8086
    //   }
    // ];
    // devices.forEach((dev) => {
    //   connect(dev);
    // });
  }

  function connect(dev) {
    const { host, port } = dev

    global.spiderman.tcpserver.createServer({
      host,
      port,
      onReadly: (server) => {
        // console.log("worker-iotrouter onReadly", server);
      },
      onConnect: (server) => {
        // console.log("worker-iotrouter onConnect", server);
        // const device = {
        //   ...dev,
        //   server,
        // };
        // allDevices.push(device);
      },
      onData: (socket, data) => {
        // console.log("worker-iotrouter onData", socket);
        const time = new Date().valueOf()

        let ipAddress = socket.remoteAddress
        ipAddress = ipAddress.replace('::ffff:', '')
        // console.log("worker-iotrouter onData", ipAddress);

        if (data[1] == 3) {
          // <Buffer 01 03 14 00 00 00 00 00 05 00 e1 01 a3 01 11 01 f8 00 09 00 0a 00 00 3f 94>

          if (data[0] == 1) {
            // 01 03 14
            // 00 00 風速
            // 00 00 風力
            // 00 05 風向(0~7)
            // 00 E1 風向(度)
            // 02 1E 濕度%RH
            // 01 27 溫度C
            // 01 EF 噪音dB
            // 00 06 PM2.5(ug/m3)
            // 00 07 PM10 (ug/m3)
            // 00 00 大氣壓力 (kPa)
            // 8B 9C

            let pm25 = -1.0
            let pm10 = -1.0
            let humidity = -1.0
            let temperature = -1.0
            let noise = -1.0
            let windSpeed = -1.0
            let windLevel = -1.0
            let windDir = -1.0
            let windAngle = -1.0

            try {
              windSpeed = data[3] * 256 + data[4]
            }
            catch (ex) {
              windSpeed = -1.0
            }
            try {
              windLevel = data[5] * 256 + data[6]
            }
            catch (ex) {
              windLevel = -1.0
            }
            try {
              windDir = data[7] * 256 + data[8]
            }
            catch (ex) {
              windDir = -1.0
            }
            try {
              windAngle = data[9] * 256 + data[10]
            }
            catch (ex) {
              windAngle = -1.0
            }
            try {
              humidity = (data[11] * 256 + data[12]) / 10
            }
            catch (ex) {
              humidity = -1.0
            }
            try {
              temperature = (data[13] * 256 + data[14]) / 10
            }
            catch (ex) {
              temperature = -1.0
            }
            try {
              noise = (data[15] * 256 + data[16]) / 10
            }
            catch (ex) {
              noise = -1.0
            }
            try {
              pm25 = data[17] * 256 + data[18]
            }
            catch (ex) {
              pm25 = -1.0
            }
            try {
              pm10 = data[19] * 256 + data[20]
            }
            catch (ex) {
              pm10 = -1.0
            }
            try {
              pressure = data[21] * 256 + data[22]
            }
            catch (ex) {
              pressure = -1.0
            }

            // console.log("worker-iotrouter onData", pm25, pm10, humidity, temperature, noise, windSpeed, windLevel, windDir, windAngle );

            let message = {
              pm10,
              pm25,
              noise,
              windSpeed,
              windLevel,
              windDir,
              windAngle,
            }
            console.log('worker-iotrouter onData', message)

            global.domain.workerMongo.insertOne(
              'DeviceRow',
              {
                topic: ipAddress,
                time,
                datetime: new Date(time).toLocaleString(),
                message,
              },
              (err, data) => {
                if (data) {
                  data.forEach((record) => {
                    console.log('mqtt workder onData', record)
                    global.spiderman.socket.broadcastMessage({
                      socketServer: global.spiderman.server.wsDeviceStatus,
                      message: JSON.stringify(record),
                    })
                  })
                }
              },
            )

            message = {
              T: temperature,
              H: humidity,
            }
            console.log('worker-iotrouter onData', message)

            global.domain.workerMongo.insertOne(
              'DeviceRow',
              {
                topic: ipAddress,
                time,
                datetime: new Date(time).toLocaleString(),
                message,
              },
              (err, data) => {
                if (data) {
                  data.forEach((record) => {
                    console.log('mqtt workder onData', record)
                    global.spiderman.socket.broadcastMessage({
                      socketServer: global.spiderman.server.wsDeviceStatus,
                      message: JSON.stringify(record),
                    })
                  })
                }
              },
            )
          }

          if (data[0] == 2) {
            // 02 03 10
            // 01 D6 濕度
            // 01 0B 溫度
            // 02 5C 噪音
            // 00 09 PM2.5
            // 00 0A PM10
            // 6E 1B

            let pm25 = -1.0
            let pm10 = -1.0
            let noise = -1.0
            let humidity = -1.0
            let temperature = -1.0

            try {
              humidity = (data[3] * 256 + data[4]) / 10
            }
            catch (ex) {
              humidity = -1.0
            }
            try {
              temperature = (data[5] * 256 + data[6]) / 10
            }
            catch (ex) {
              temperature = -1.0
            }
            try {
              noise = (data[7] * 256 + data[8]) / 10
            }
            catch (ex) {
              noise = -1.0
            }
            try {
              pm25 = data[9] * 256 + data[10]
            }
            catch (ex) {
              pm25 = -1.0
            }
            try {
              pm10 = data[11] * 256 + data[12]
            }
            catch (ex) {
              pm10 = -1.0
            }

            // console.log("worker-iotrouter onData", pm25, pm10, humidity, temperature, noise);

            let message = {
              pm10,
              pm25,
              noise,
            }
            console.log('worker-iotrouter onData', message)

            global.domain.workerMongo.insertOne(
              'DeviceRow',
              {
                topic: ipAddress,
                time,
                datetime: new Date(time).toLocaleString(),
                message,
              },
              (err, data) => {
                if (data) {
                  data.forEach((record) => {
                    console.log('mqtt workder onData', record)
                    global.spiderman.socket.broadcastMessage({
                      socketServer: global.spiderman.server.wsDeviceStatus,
                      message: JSON.stringify(record),
                    })
                  })
                }
              },
            )

            message = {
              T: temperature,
              H: humidity,
            }
            console.log('worker-iotrouter onData', message)

            global.domain.workerMongo.insertOne(
              'DeviceRow',
              {
                topic: ipAddress,
                time,
                datetime: new Date(time).toLocaleString(),
                message,
              },
              (err, data) => {
                if (data) {
                  data.forEach((record) => {
                    console.log('mqtt workder onData', record)
                    global.spiderman.socket.broadcastMessage({
                      socketServer: global.spiderman.server.wsDeviceStatus,
                      message: JSON.stringify(record),
                    })
                  })
                }
              },
            )
          }
        }
      },

      onClose: () => {
        // todo 自動恢復連線
      },
      onError: () => {},
    })
  }

  //   function trigger({ action, data }) {
  //     // global.spiderman.systemlog.writeInfo(`domain worker-iobox trigger ${action} ${data}`);

  //     const { client } = allDevices.find((i) => i.host === action.host);

  //     const command = generateCommand({ no, status: triggerStatus, delay });

  //     send({ client, command });
  //   }

  //   function generateCommand({ no, status, delay = '' }) {
  //     status = status ? 1 : 0;
  //     if (!delay) return `AT+STACH${no}=${status}\n`;

  //     const ret = `AT+STACH${no}=${status},${delay}\n`;

  //     global.spiderman.systemlog.writeInfo(`domain worker-iobox generateCommand ${ret}`);

  //     return ret;
  //   }

  //   function send({ client, command }) {
  //     const buffer = Buffer.from(command, 'ascii');
  //     client.write(buffer);
  //   }

  return {
    init,
    //     trigger,
  }
}
