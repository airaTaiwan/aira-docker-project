const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: true,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `eventhandle remove ${JSON.stringify(data)}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.eventhandle.remove({ uuid: data.uuid })

  return {
    message: 'ok',
  }
}
