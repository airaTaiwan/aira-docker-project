const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'model',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'ip',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `env devicescomm create ${data.deviceId}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.devicescomm.create(data)

  global.spiderman.systemlog.writeInfo(
    `env devicescomm create ${data.deviceId}`,
  )

  return {
    message: 'ok',
  }
}
