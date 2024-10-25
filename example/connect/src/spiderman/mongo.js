const MongoClient = require('mongodb').MongoClient

module.exports = () => {
  let client = null

  async function connect({
    url,
    host,
    port,
    user,
    pass,
    onConnect = () => {},
    onData = () => {},
    onClose = () => {},
    onError = () => {},
  }) {
    // console.log("mongo connect");
    // 建立  連線
    const option = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      directConnection: true,

      maxPoolSize: 5,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    if (user) {
      option.user = user || ''
      option.password = pass || ''
    }

    try {
      if (!url) {
        url = url = `mongodb://`

        if (user != '' || pass != '') {
          const username = encodeURIComponent(user)
          const password = encodeURIComponent(pass)

          url += `${username}:${password}@`
        }

        url += `${host}:${port}?directConnection=true`
      }

      client = new MongoClient(url, option)

      client.connect((err, conn) => {
        if (err) {
          console.log('mongodb onError')
          // console.log(err);
          onError(client, err)
        }
        else {
          console.log('mongodb onConnect')
          onConnect(client)
        }

        // maintainConnection();
      })

      client.on('serverClosed', () => {
        console.log('mongodb onClose')
        onClose(client)
      })
    }
    catch (ex) {
      console.log('mongodb onError')
      // console.log(ex);

      onError(client, ex)
    }

    return client
  }

  return {
    connect,
  }
}
