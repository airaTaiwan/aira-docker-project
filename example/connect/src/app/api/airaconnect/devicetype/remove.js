const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`group remove ${data.uuid}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.devicetype.remove(data)

  return {
    message: 'ok',
  }
}
