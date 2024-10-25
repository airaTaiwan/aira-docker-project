const fieldChecks = [
  {
    fieldName: 'dateCode',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'deviceId',
    fieldType: 'array',
    required: false,
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
    `findmetadata find ${data.dateCode} ${data.deviceId}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  data.collection = 'DeviceRowEventStat'

  data.deviceId = data.deviceId ? data.deviceId : []
  if (!Array.isArray(data.deviceId))
    data.deviceId = []
  data.slice_shift = data.slice_shift ? data.slice_shift : 0
  data.slice_length = data.slice_length ? data.slice_length : 10000

  const { total_length, list }
    = await global.domain.report.findDeviceRowEventStat(data)

  const ret = {
    message: 'ok',
    total_length,
    slice_shift: data.slice_shift,
    slice_length: data.slice_length,
    list,
  }

  global.spiderman.systemlog.writeInfo(
    `findrowdata find total_length ${total_length}, slice_shift ${data.slice_shift}, slice_length ${data.slice_length}, list ${list.length}`,
  )

  return ret
}
