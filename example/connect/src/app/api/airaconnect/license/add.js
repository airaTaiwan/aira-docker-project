const fieldChecks = [
  {
    fieldName: 'license_server_address',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'license_server_port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'license_key',
    fieldType: 'string',
    required: true,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`license add ${JSON.stringify(data)}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/addlicense`,
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
    `license add ${JSON.stringify(response.body)}`,
  )

  return response
}
