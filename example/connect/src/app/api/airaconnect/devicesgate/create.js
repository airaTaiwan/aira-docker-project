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
    `env devicesgate create ${data.deviceId}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.devicesgate.create(data)

  global.spiderman.systemlog.writeInfo(
    `env devicesgate create ${data.deviceId}`,
  )

  return {
    message: 'ok',
  }
}
