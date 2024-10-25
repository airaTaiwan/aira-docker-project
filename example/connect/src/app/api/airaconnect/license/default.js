module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `license default ${JSON.stringify(data)}`,
  )

  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/gendefaultlicense`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: data,
  })

  global.spiderman.systemlog.writeInfo(
    `license default ${JSON.stringify(response.body)}`,
  )

  return response
}
