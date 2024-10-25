const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`devicesele remove ${data.uuid}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.devicesele.remove(data)

  return {
    message: 'ok',
  }
}
