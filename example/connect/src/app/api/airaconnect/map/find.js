const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`devicesenv find ${data.uuid}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const { total_length, slice_shift, slice_length, list }
    = await global.domain.map.find(data)

  const ret = {
    message: 'ok',
    total_length,
    slice_shift,
    slice_length,
    list,
  }

  global.spiderman.systemlog.writeInfo(
    `devicesenv find total_length ${total_length}, slice_shift ${slice_shift}, slice_length ${slice_length}, list ${list.length}`,
  )

  return ret
}
