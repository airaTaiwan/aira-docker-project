const { reject } = require('lodash')
const { resolve } = require('mongodb/lib/core/topologies/read_preference')
const request = require('request')

module.exports = () => {
  // function init() {

  // }

  async function getMediaUrl_ts(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime,
    endTime,
    callabck,
  ) {
    const localStartTime = Math.floor(+startTime / 1000) * 1000
    const localEndTime = Math.floor(+endTime / 1000) * 1000

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      let targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/hls/${cameraId}.ts?access_token=${bearerToken}`
      if (startTime != 0 && endTime != 0) {
        const duration = localEndTime / 1000 - localStartTime / 1000
        if (duration > 0) {
          targetMedia += `&pos=${localStartTime}&duration=${duration}`
        }
      }
      const returnData = {
        error: null,
        data: {
          url: targetMedia,
          username,
          password,
          token,
        },
      }
      if (callabck) {
        callabck(Object.assign({}, returnData))
      }
      resolve(Object.assign({}, returnData))
    })
  }

  async function getMediaUrl_mkv(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime,
    endTime,
    callabck,
  ) {
    const localStartTime = Math.floor(+startTime / 1000) * 1000
    const localEndTime = Math.floor(+endTime / 1000) * 1000

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      let targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/hls/${cameraId}.mkv?access_token=${token}`
      if (startTime != 0 && endTime != 0) {
        const duration = localEndTime / 1000 - localStartTime / 1000
        if (duration > 0) {
          targetMedia += `&pos=${localStartTime}&duration=${duration}`
        }
      }
      const returnData = {
        error: null,
        data: {
          url: targetMedia,
          username,
          password,
          token,
        },
      }
      if (callabck) {
        callabck(Object.assign({}, returnData))
      }
      resolve(Object.assign({}, returnData))
    })
  }

  async function getMediaUrl_webm(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime = 0,
    endTime = 0,
    callabck,
  ) {
    const localStartTime = Math.floor(+startTime / 1000) * 1000
    const localEndTime = Math.floor(+endTime / 1000) * 1000

    const startTimeString = new Date(localStartTime).toISOString()
    const endTimeString = new Date(localEndTime).toISOString()

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      let targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/media/${cameraId}.webm?access_token=${token}`
      if (startTime != 0 && endTime != 0) {
        // const duration = (endTime / 1000) - (startTime / 1000);
        targetMedia += `&pos=${startTimeString}&endPos=${endTimeString}`
      }
      const returnData = {
        error: null,
        data: {
          url: targetMedia,
          username,
          password,
          token,
        },
      }
      if (callabck) {
        callabck(Object.assign({}, returnData))
      }
      resolve(Object.assign({}, returnData))
    })
  }

  async function getMediaUrl_mp4(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime,
    endTime,
    callabck,
  ) {
    const localStartTime = Math.floor(+startTime / 1000) * 1000
    const localEndTime = Math.floor(+endTime / 1000) * 1000

    const startTimeString = new Date(localStartTime).toISOString()
    const endTimeString = new Date(localEndTime).toISOString()

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      let targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/media/${cameraId}.mp4?access_token=${token}`
      if (startTime != 0 && endTime != 0) {
        // const duration = (endTime / 1000) - (startTime / 1000);
        targetMedia += `&pos=${startTimeString}&endPos=${endTimeString}`
      }
      const returnData = {
        error: null,
        data: {
          url: targetMedia,
          username,
          password,
          token,
        },
      }
      if (callabck) {
        callabck(Object.assign({}, returnData))
      }
      resolve(Object.assign({}, returnData))
    })
  }

  async function getMediaUrl_mpegts(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime,
    endTime,
    callabck,
  ) {
    const localStartTime = Math.floor(+startTime / 1000) * 1000
    const localEndTime = Math.floor(+endTime / 1000) * 1000

    const startTimeString = new Date(localStartTime).toISOString()
    const endTimeString = new Date(localEndTime).toISOString()

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      let targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/media/${cameraId}.mpegts?access_token=${token}`
      if (startTime != 0 && endTime != 0) {
        // const duration = (endTime / 1000) - (startTime / 1000);
        targetMedia += `&pos=${startTimeString}&endPos=${endTimeString}`
      }
      const returnData = {
        error: null,
        data: {
          url: targetMedia,
          username,
          password,
          token,
        },
      }
      if (callabck) {
        callabck(Object.assign({}, returnData))
      }
      resolve(Object.assign({}, returnData))
    })
  }

  async function getMediaUrl_m3u8(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime,
    endTime,
    callabck,
  ) {
    const localStartTime = Math.floor(+startTime / 1000) * 1000
    const localEndTime = Math.floor(+endTime / 1000) * 1000

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      let targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/hls/${cameraId}.m3u8?access_token=${token}`
      if (startTime != 0 && endTime != 0) {
        const duration = localEndTime / 1000 - localStartTime / 1000
        if (duration > 0) {
          targetMedia += `&pos=${localStartTime}&duration=${duration}`
        }
      }
      const returnData = {
        error: null,
        data: {
          url: targetMedia,
          username,
          password,
          token,
        },
      }
      if (callabck) {
        callabck(Object.assign({}, returnData))
      }
      resolve(Object.assign({}, returnData))
    })
  }

  async function getSysteminfo(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    callabck,
  ) {
    const ret = await global.spiderman.nxdriver.getSysteminfo(
      serverAddress,
      serverPort,
      username,
      password,
      authorization,
    )
    return new Promise((resolve) => {
      if (callabck) {
        callabck(Object.assign({}, ret))
      }
      resolve(Object.assign({}, ret))
    })
  }

  async function getServerList(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    callabck,
  ) {
    const ret = await global.spiderman.nxdriver.getMediaServersEx(
      serverAddress,
      serverPort,
      username,
      password,
      authorization,
    )

    return new Promise((resolve) => {
      if (callabck) {
        callabck(Object.assign({}, ret))
      }
      resolve(Object.assign({}, ret))
    })
  }

  async function getCameraList(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    callabck,
  ) {
    const ret = await global.spiderman.nxdriver.getCamerasEx(
      serverAddress,
      serverPort,
      username,
      password,
      authorization,
    )
    return new Promise((resolve) => {
      if (callabck) {
        callabck(Object.assign({}, ret))
      }
      resolve(Object.assign({}, ret))
    })
  }

  async function getAddBookmarkEx(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    params,
    callabck,
  ) {
    const ret = await global.spiderman.nxdriver.getAddBookmarkEx(
      serverAddress,
      serverPort,
      username,
      password,
      authorization,
      params,
    )
    return new Promise((resolve) => {
      if (callabck) {
        callabck(Object.assign({}, ret))
      }
      resolve(Object.assign({}, ret))
    })
  }

  async function getSnapshotUrl(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    params,
    callabck,
  ) {
    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      let targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/ec2/cameraThumbnail?access_token=${token}&cameraId=${params.cameraId}`

      if (params.timeStamp)
        targetMedia += `&time=${params.timeStamp}`

      const returnData = {
        error: null,
        data: {
          url: targetMedia,
          username,
          password,
          token,
        },
      }

      if (callabck) {
        callabck(Object.assign({}, returnData))
      }
      resolve(Object.assign({}, returnData))
    })
  }

  async function viewmedia(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    params,
  ) {
    try {
      if (mediaRequest)
        mediaRequest.abort()
    }
    catch (ex) {}

    console.log('nx viewmedia', params)

    const cameraId = params.cameraId
    const startTime = params.startTime
    const endTime = params.endTime
    const mediaType = params.mediaType

    console.log('nx viewmedia', cameraId, startTime, endTime, mediaType)

    let targetMedia = ''

    switch (mediaType) {
      case 'webm':
        targetMedia = await getMediaUrl_webm(
          serverAddress,
          serverPort,
          username,
          password,
          authorization,
          cameraId,
          startTime,
          endTime,
        )
        break
      case 'ts':
        targetMedia = await getMediaUrl_ts(
          serverAddress,
          serverPort,
          username,
          password,
          authorization,
          cameraId,
          startTime,
          endTime,
        )
        break
      case 'mkv':
        targetMedia = await getMediaUrl_mkv(
          serverAddress,
          serverPort,
          username,
          password,
          authorization,
          cameraId,
          startTime,
          endTime,
        )
        break
      case 'mp4':
        targetMedia = await getMediaUrl_mp4(
          serverAddress,
          serverPort,
          username,
          password,
          authorization,
          cameraId,
          startTime,
          endTime,
        )
        break
      case 'mpegts':
        targetMedia = await getMediaUrl_mpegts(
          serverAddress,
          serverPort,
          username,
          password,
          authorization,
          cameraId,
          startTime,
          endTime,
        )
        break
      case 'm3u8':
        targetMedia = await getMediaUrl_m3u8(
          serverAddress,
          serverPort,
          username,
          password,
          authorization,
          cameraId,
          startTime,
          endTime,
        )
        break
    }

    // targetMedia += `/hls/${params.camera_id}.${mediaType}?auth=${bearerToken}&pos=${startTimeString}&endPos=${endTimeString}`;

    console.log('nx viewmedia', targetMedia.data.url)

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    const options = {
      url: targetMedia.data.url,
      responseType: 'stream',
      timeout: 5000,
      headers: {
        'content-type': 'text/json',
      },
    }

    if (authorization == 'bearer') {
      options.headers.authorization = `bearer ${token}`
    }

    try {
      let contentLength = 0
      mediaRequest = request
        .get(options)
        .on('response', (response) => {
          console.log('response.statusCode', response.statusCode)
          params.res.statusCode = response.statusCode

          console.log('response.headers', response.headers)

          if (response.headers)
            console.log('content-type', response.headers['content-type'])

          if (response.headers['content-type']) {
            params.res.setHeader(
              'content-type',
              response.headers['content-type'],
            )
          }
        })
        .on('error', (err) => {
          console.log('onerror', err)
        })
        .on('data', (chunk) => {
          contentLength += chunk.length
          console.log('ondata', contentLength)
          params.res.write(chunk)
        })
        .on('close', () => {
          console.log('onclose')
        })
        .on('end', () => {
          if (contentLength == 0)
            params.res.setHeader('content-length', 0)

          params.res.end()
          // console.log("onend");
        })
    }
    catch (ex) {
      console.log('try catch', ex)
    }
  }

  async function downloadvideomedia(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    params,
  ) {
    try {
      if (mediaRequest)
        mediaRequest.abort()
    }
    catch (ex) {}

    const cameraId = params.cameraId
    const startTime = params.startTime
    const endTime = params.endTime
    const fileName = params.fileName

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    const targetMedia = `https://${username}:${password}@${serverAddress}:${serverPort}/media/${cameraId}.webm?access_token=${token}&pos=${startTime}&endPos=${endTime}`

    const options = {
      url: targetMedia,
      responseType: 'stream',
      timeout: 5000,
      headers: {
        'content-type': 'text/json',
        // "authorization":
        //     authorization == "bearer"
        //         ? "bearer " + bearerToken
        //         : "basic " + bearerToken
      },
    }

    if (authorization == 'bearer') {
      options.headers.authorization = `bearer ${token}`
    }

    return new Promise((resolve) => {
      try {
        const file = fs.createWriteStream(fileName)
        mediaRequest = request
          .get(options)
          // .pipe(file)
          .on('response', (response) => {
            console.log('statusCode', response.statusCode)

            if (response.statusCode == 200) {
              file.on('finish', () => {
                console.log('finish')
                file.close()
                resolve(true)
              })
              file.on('error', (err) => {
                console.log('file error', err)
                resolve(false)
              })

              response.pipe(file)
            }
            else {
              resolve(false)
            }
          })
          .on('error', (err) => {
            // console.log('response', err);
            // resolve(false);
          })
      }
      catch (ex) {
        console.log('try catch', ex)
        resolve(false)
      }
    })
  }

  async function viewsnapshot(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    params,
  ) {
    let targetSnapshot = ''

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    targetSnapshot = `https://${username}:${password}@${serverAddress}:${serverPort}/ec2/cameraThumbnail?cameraId=${params.cameraId}`

    if (params.timeStamp)
      targetSnapshot += `&time=${params.timeStamp}`

    console.log('targetSnapshot', targetSnapshot)
    const options = {
      url: targetSnapshot,
      timeout: 5000,
      headers: {
        'content-type': 'text/json',
      },
    }

    if (authorization == 'bearer') {
      options.headers.authorization = `bearer ${token}`
    }

    try {
      return await new Promise((resolve, reject) => {
        const req = request
          .get(options)
          .on('response', (response) => {
            console.log('onresponse')

            params.res.statusCode = response.statusCode

            try {
              if (response.headers) {
                switch (response.headers['content-type']) {
                  case 'image/jpg':
                    params.res.setHeader('content-type', 'image/jpeg')
                    break
                  default:
                    if (response.headers['content-type']) {
                      params.res.setHeader(
                        'content-type',
                        response.headers['content-type'],
                      )
                    }
                    break
                }
              }
            }
            catch (ex) {
              console.log('nx viewsnapshot response', ex)
            }
          })
          .on('error', (err) => {
            console.log('onerror', err)
          })
          .on('data', (chunk) => {
            console.log('ondata', chunk.length)
            try {
              params.res.write(chunk)
            }
            catch (ex) {
              console.log('nx viewsnapshot ondata', ex)
            }
          })
          .on('close', () => {
            console.log('onclose')
          })
          .on('end', () => {
            console.log('onend')
            params.res.end()

            resolve(true)
          })
      })
    }
    catch (ex) {
      console.log('try catch', ex)
    }
  }

  async function getMotionMediaArchiveUrlList_webm(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime,
    endTime,
    callabck,
  ) {
    let timeStr = ''

    if (startTime && endTime) {
      const localStartTime = Math.floor(+startTime / 1000) * 1000
      const localEndTime = Math.floor(+endTime / 1000) * 1000
      const startTimeString = new Date(localStartTime).toISOString()
      const endTimeString = new Date(localEndTime).toISOString()
      timeStr = `&startTime=${startTimeString}&endTime=${endTimeString}`
    }

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      const optionsToFindMotionRec = {
        url: `https://${username}:${password}@${serverAddress}:${serverPort}/ec2/recordedTimePeriods?periodsType=1&cameraId=${cameraId}&access_token=${token}${timeStr}`,
        timeout: 5000,
        headers: {
          'content-type': 'text/json',
        },
      }

      if (authorization == 'bearer') {
        optionsToFindMotionRec.headers.authorization = `bearer ${token}`
      }

      request.get(optionsToFindMotionRec, (err, response, body) => {
        const listToReturn = []
        if (!err && response.statusCode == 200) {
          try {
            const resDataMotionRec = JSON.parse(body)
            if (resDataMotionRec.reply && resDataMotionRec.reply.length > 0) {
              resDataMotionRec.reply.forEach((reply) => {
                if (reply.periods && reply.periods.length > 0) {
                  reply.periods.forEach((period) => {
                    // console.log( period );
                    const startPos = new Date(
                      Number(period.startTimeMs),
                    ).toISOString()
                    const endPos = new Date(
                      Number(period.startTimeMs) + Number(period.durationMs),
                    ).toISOString()
                    listToReturn.push({
                      camera_id: cameraId,
                      start_time: Number(period.startTimeMs),
                      end_time:
                        Number(period.startTimeMs) + Number(period.durationMs),
                      url: `https://${username}:${password}@${serverAddress}:${serverPort}/media/${cameraId}.webm?pos=${startPos}&endPos=${endPos}&access_token=${token}`,
                    })
                  })
                }
              })
            }
          }
          catch (e) {}
        }
        if (callabck) {
          callabck(listToReturn)
        }
        resolve(listToReturn)
      })
    })
  }

  async function getMotionMediaArchiveUrlList_mp4(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    cameraId,
    startTime,
    endTime,
    callabck,
  ) {
    let timeStr = ''
    if (startTime && endTime) {
      const localStartTime = Math.floor(+startTime / 1000) * 1000
      const localEndTime = Math.floor(+endTime / 1000) * 1000
      const startTimeString = new Date(localStartTime).toISOString()
      const endTimeString = new Date(localEndTime).toISOString()
      timeStr = `&startTime=${startTimeString}&endTime=${endTimeString}`
    }

    let token = ''
    if (authorization == 'bearer') {
      token = await global.spiderman.nxdriver.getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await global.spiderman.nxdriver.getBasicToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }

    return new Promise((resolve) => {
      const optionsToFindMotionRec = {
        url: `https://${username}:${password}@${serverAddress}:${serverPort}/ec2/recordedTimePeriods?periodsType=1&cameraId=${cameraId}&access_token=${token}${timeStr}`,
        timeout: 5000,
        headers: {
          'content-type': 'text/json',
        },
      }

      if (authorization == 'bearer') {
        optionsToFindMotionRec.headers.authorization = `bearer ${token}`
      }

      request.get(optionsToFindMotionRec, (err, response, body) => {
        const listToReturn = []
        if (!err && response.statusCode == 200) {
          try {
            const resDataMotionRec = JSON.parse(body)
            if (resDataMotionRec.reply && resDataMotionRec.reply.length > 0) {
              resDataMotionRec.reply.forEach((reply) => {
                if (reply.periods && reply.periods.length > 0) {
                  reply.periods.forEach((period) => {
                    // console.log( period );
                    const startPos = new Date(
                      Number(period.startTimeMs),
                    ).toISOString()
                    const endPos = new Date(
                      Number(period.startTimeMs) + Number(period.durationMs),
                    ).toISOString()
                    listToReturn.push({
                      camera_id: cameraId,
                      start_time: Number(period.startTimeMs),
                      end_time:
                        Number(period.startTimeMs) + Number(period.durationMs),
                      url: `https://${username}:${password}@${serverAddress}:${serverPort}/media/${cameraId}.mp4?access_token=${token}&pos=${startPos}&endPos=${endPos}`,
                    })
                  })
                }
              })
            }
          }
          catch (e) {}
        }
        if (callabck) {
          callabck(listToReturn)
        }
        resolve(listToReturn)
      })
    })
  }

  return {
    // init,
    getSysteminfo,
    getServerList,
    getCameraList,
    getSnapshotUrl,
    getAddBookmarkEx,
    viewsnapshot,
    viewmedia,
    downloadvideomedia,

    getMotionMediaArchiveUrlList_webm,
    getMotionMediaArchiveUrlList_mp4,
  }
}
