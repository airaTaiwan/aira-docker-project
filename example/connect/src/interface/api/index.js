const perf = require('node:perf_hooks')

const cgiCounter = {
  number: 0,
  max: 50,
}

module.exports = (route) => {
  const myService = require('express')()
  const { publicCgi, router } = require(`.${route}`)()

  myService.post('/:cgi', async (req, res) => {
    const startTime = perf.performance.now()
    const { cgi } = req.params
    try {
      addCgiCounter(cgi)
      if (!router[cgi])
        throw new Error('no such cgi')
      global.spiderman.systemlog.writeInfo(`${cgi} has been called.`)
      const user = await authenticate({ req, publicCgi })
      if (!user && !publicCgi.includes(cgi))
        throw new Error('Unauthorized')
      const body = getBody(req)
      const jsonResponse = await router[cgi](body, user, res)
      processResponse(jsonResponse, res)
    }
    catch (error) {
      handleError(error, res, cgi)
    }
    finally {
      minusCgiCounter(cgi)

      const endTime = perf.performance.now()
      console.log(`${cgi} spend ${(endTime - startTime).toFixed(2)} ms`)
    }
  })

  myService.get('/:cgi', async (req, res) => {
    const startTime = perf.performance.now()
    const { cgi } = req.params
    try {
      addCgiCounter(cgi)
      if (!router[cgi])
        throw new Error('no such cgi')
      global.spiderman.systemlog.writeInfo(`${cgi} has been called.`)
      const user = await authenticate({ req, publicCgi })
      if (!user && !publicCgi.includes(cgi))
        throw new Error('Unauthorized')
      const body = getBody(req)
      const jsonResponse = await router[cgi](body, user, res)
      processResponse(jsonResponse, res)
    }
    catch (error) {
      handleError(error, res, cgi)
    }
    finally {
      minusCgiCounter(cgi)

      const endTime = perf.performance.now()
      console.log(`${cgi} spend ${(endTime - startTime).toFixed(2)} ms`)
    }
  })

  return myService
}

function addCgiCounter(cgi) {
  cgiCounter.number += 1
  console.log(`${cgi} 'on' cgi counter: ${cgiCounter.number}`)
  checkIsCgiExceeded()
}

function checkIsCgiExceeded() {
  const { number, max } = cgiCounter
  if (number + 1 > max) {
    throw new Error(
      'Too Many Requests, server allows upto max 50 request concurrently.',
    )
  }
}

function minusCgiCounter(cgi) {
  cgiCounter.number -= 1
  console.log(`${cgi} 'off' cgi counter: ${cgiCounter.number}`)
}

function getBody(req) {
  if (req.is('multipart/form-data')) {
    return {
      ...global.spiderman.parse.circularJson(req.body),
      ...req.files,
    }
  }

  if (req.is('json')) {
    return global.spiderman.parse.circularJson(req.body)
  }

  if (req.query) {
    return global.spiderman.parse.circularJson(req.query)
  }

  throw new Error('System: no such request type')
}

function processResponse(jsonResponse, res) {
  if (jsonResponse) {
    if (jsonResponse?.action === 'download') {
      const { path, fileName } = jsonResponse
      res.download(path, fileName, (err) => {
        if (!err)
          return
        res.status(404).json({ message: 'file not found' })
      })
    }
    else {
      res.status(200).json(jsonResponse)
    }
  }
}

function handleError(error, res, cgi) {
  const errorCode = determinErrorCode(error)

  const warningCodes = [401]
  if (warningCodes.includes(errorCode)) {
    global.spiderman.systemlog.writeWarning(`${cgi} ${error.message}`)
  }
  else {
    global.spiderman.systemlog.writeError(`${cgi} ${error.message}`)
  }

  res.status(errorCode).json({ message: error.message })
}

function determinErrorCode(error) {
  return (
    {
      'Too Many Requests, server allows upto max 50 request concurrently.': 429,
      'Unauthorized': 401,
    }[error.message] ?? 400
  )
}

async function authenticate({ req }) {
  const token
    = req.headers.token
    ?? req.query?.token
    ?? req.headers.sessionId
    ?? req.query?.sessionId
    ?? undefined
  // if (token === global.params.session.godSession) return {}
  if (!token)
    return undefined
  return await global.spiderman.token.decryptToAccountInTime(token)
}
