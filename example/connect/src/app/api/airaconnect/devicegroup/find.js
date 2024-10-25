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
  global.spiderman.systemlog.writeInfo(`devicegroup find ${data.uuid}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const { total_length, list: data_list }
    = await global.domain.devicegroup.find(data)

  const ret = {
    message: 'ok',
    data_list,
  }

  global.spiderman.systemlog.writeInfo(`devicegroup find ${data.uuid}`)

  return ret
}
