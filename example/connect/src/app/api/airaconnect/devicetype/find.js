const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'typeId',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `devicetype find ${data.uuid} ${data.typeId}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const { total_length, list } = await global.domain.devicetype.find(data)

  const ret = {
    message: 'ok',
    list,
  }

  global.spiderman.systemlog.writeInfo(`group find ${data.uuid} ${data.typeId}`)

  return ret
}
