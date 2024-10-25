const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'action_type',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `eventhandle find ${JSON.stringify(data)}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const sliceShift = data.slice_shift ? data.slice_shift : 0
  const sliceLength = data.slice_length ? data.slice_length : 10000
  const { uuid, action_type: actionType } = data

  const { totalLength, result } = await global.domain.eventhandle.find({
    uuid,
    actionType,
    sliceShift,
    sliceLength,
  })

  const ret = {
    message: 'ok',
    total_length: totalLength,
    slice_shift: sliceShift,
    slice_length: sliceLength,
    list: result,
  }

  global.spiderman.systemlog.writeInfo(
    `dashboardsettings get ${JSON.stringify(ret)}`,
  )

  return ret
}
