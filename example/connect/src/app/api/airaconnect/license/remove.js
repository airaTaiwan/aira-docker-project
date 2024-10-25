const fieldChecks = [
  {
    fieldName: 'license_key',
    fieldType: 'string',
    required: true,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`license remove ${JSON.stringify(data)}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/removelicense`,
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
    `license remove ${JSON.stringify(response.body)}`,
  )

  return response
}
