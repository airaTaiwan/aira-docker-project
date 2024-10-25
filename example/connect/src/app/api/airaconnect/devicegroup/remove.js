const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: false,
  },
  // {
  //   fieldName: 'typeId',
  //   fieldType: 'array',
  //   required: false,
  // },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`devicegroup remove ${data.uuid}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.devicegroup.remove(data)

  return {
    message: 'ok',
  }
}
