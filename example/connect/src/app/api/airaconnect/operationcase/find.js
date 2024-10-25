const fieldChecks = [
  {
    fieldName: 'start_time',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'end_time',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'slice_shift',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'slice_length',
    fieldType: 'number',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `operationcase find ${data.start_time} ${data.end_time}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  data.sliceShift = data.slice_shift ? data.slice_shift : 0
  data.sliceLength = data.slice_length ? data.slice_length : 10000

  const { total_length, result: list }
    = await global.domain.operationcase.find(data)

  const ret = {
    message: 'ok',
    total_length,
    slice_shift: data.slice_shift,
    slice_length: data.slice_length,
    list,
  }

  global.spiderman.systemlog.writeInfo(
    `operationcase find total_length ${total_length}, slice_shift ${data.slice_shift}, slice_length ${data.slice_length}, list ${list.length}`,
  )

  return ret
}
