const fieldChecks = [
  {
    fieldName: 'time',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'reporter',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'locationId',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'areaId',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'camera',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'currStatus',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'note',
    fieldType: 'string',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `operationlog create ${data.time} ${data.reporter}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.operationcase.create(data)
  const { totalLength } = await global.domain.operationcase.find({
    start_time: 0,
    end_time: 0,
  })

  global.spiderman.systemlog.writeInfo(
    `operationlog create ${data.time} ${data.reporter}`,
  )

  return {
    message:
      totalLength <= 200
        ? 'ok'
        : 'You have exceeded the limit of 200 entries in your diary. Please download it as a backup.',
  }
}
