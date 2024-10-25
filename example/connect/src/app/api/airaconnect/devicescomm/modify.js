const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'data',
    fieldType: 'object',
    required: true,
  },
]

const fieldChecksData = [
  {
    fieldName: 'name',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'model',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'ip',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: false,
  },
]

module.exports = async (rData) => {
  global.spiderman.systemlog.writeInfo(
    `devicescomm modify ${rData.uuid} ${rData.data.name}`,
  )

  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  })

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  })

  await global.domain.devicescomm.modify({ uuid, ...data })

  global.spiderman.systemlog.writeInfo(
    `devicescomm modify ${rData.uuid} ${rData.data.name}`,
  )

  return {
    message: 'ok',
  }
}
