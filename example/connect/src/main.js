require('dotenv').config()

const fs = require('node:fs')
const http = require('node:http')

const https = require('node:https')
const path = require('node:path')
const express = require('express')

let serverprofile = require('./spiderman/defaultdata/serverprofile')

const argObject = (() => {
  const result = {}

  process.argv.forEach((a, index) => {
    const isValid = index > 1
    if (!isValid)
      return

    const [key, value] = a.split('=')

    result[key] = value
  })

  return result
})()

global.params = generateParams(argObject)
function generateParams({
  fileroot = path.dirname(fs.realpathSync(process.mainModule.filename)),
  localhost = '127.0.0.1:8088',
}) {
  const dataPath = `${fileroot}/data`
  const swPath = `${fileroot}/sw`
  const fwPath = `${fileroot}/fw`
  const importPath = `${fileroot}/import`
  const wwwdist = `${fileroot}/wwwdist`

  try {
    serverprofile = JSON.parse(
      fs.readFileSync(`${dataPath}/db/serverprofile.db`, 'utf8'),
    )
  }
  catch (ex) {
    console.log(ex.message)
  }

  return {
    ...{ fileroot, localhost, dataPath, swPath, fwPath, importPath, wwwdist },
    ...serverprofile,
  }
}

const domain = require('./domain/index')
const spiderman = require('./spiderman/index')
// const runtimcache = require('./runtimcache/index');

global.spiderman = spiderman.init()

process.on('uncaughtException', (err) => {
  console.log('system UCE : ', err)
})

const expressApp = express()
  .use(express.json({ limit: '50mb' }))
  .use(express.text({ limit: '50mb' }))
  .use(global.spiderman.express.useCors())
  .use(global.spiderman.express.useFileUpload())
  .use(
    `/${global.params.server.prefix}`,
    require('./interface/api')(`/${global.params.server.prefix}`),
  )
  // .use('airaretial', require('./interface/api')('/airaretial'))
  // .use('/airaface', require('./interface/api')('/tablet'))
  // .use('/system', require('./interface/api')('/system'))
  .use(express.static(`${global.params.wwwdist}`))

global.spiderman.server = (() => {
  let httpServer = null
  const prefix = global.params.server.prefix.trim().toLowerCase()

  if (global.params.server.httpEnable) {
    httpServer = global.spiderman.express.createAndListenServer(
      http,
      false,
      global.params.server.httpPort,
      expressApp,
    )
  }

  let httpsServer = null
  if (global.params.server.httpsEnable) {
    httpsServer = global.spiderman.express.createAndListenServer(
      https,
      true,
      global.params.server.httpsPort,
      expressApp,
    )
  }

  const wsDeviceStatus = global.spiderman.socket.create(
    {
      server: null,
      path: `/${prefix}/ws/devicestatus`,
      noServer: true,
    },
    global.spiderman.eventEmitter,
  )
  // const wsRecognized = global.spiderman.socket.create(
  //   { server: null, path: `/${prefix}/fcsrecognizedresult`, noServer: true },
  // )
  // const wsNonrecognized = global.spiderman.socket.create(
  //   { server: null, path: `/${prefix}/fcsnonrecognizedresult`, noServer: true },
  // )
  const notificationPusher = global.spiderman.notificationPusher.create(
    {
      server: null,
      path: `/${prefix}/ws/notify`,
      noServer: true,
    },
    global.spiderman.eventEmitter,
  )
  const onUpgrade = (request, socket, head) => {
    const pathname = request.url.trim().toLowerCase()
    if (pathname === `/${prefix}/ws/devicestatus`) {
      return wsDeviceStatus.handleUpgrade(request, socket, head, ws =>
        wsDeviceStatus.emit('connection', ws, request))
    }
    //   if (pathname === '/fcsrecognizedresult') return wsRecognized.handleUpgrade(request, socket, head, (ws) => wsRecognized.emit('connection', ws, request))
    //   if (pathname === '/fcsnonrecognizedresult') wsNonrecognized.handleUpgrade(request, socket, head, (ws) => wsNonrecognized.emit('connection', ws, request))
    if (pathname === `/${prefix}/ws/notify`) {
      return notificationPusher.handleUpgrade(request, socket, head, ws =>
        notificationPusher.emit('connection', ws, request))
    }
    socket.destroy()
  }

  httpServer.on('upgrade', onUpgrade)
  httpsServer.on('upgrade', onUpgrade)

  return {
    http: httpServer,
    https: httpsServer,
    wsDeviceStatus,
    notificationPusher,
  }
})()

global.domain = domain.init()
global.domain.initdb.init()

require('./app/init')()
