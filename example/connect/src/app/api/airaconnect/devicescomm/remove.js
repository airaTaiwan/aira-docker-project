const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`devicescomm remove ${data.uuid}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.devicescomm.remove(data)

  return {
    message: 'ok',
  }
}
