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
    fieldName: 'serial',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'gateId',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'deviceId',
    fieldType: 'string',
    required: true,
  },
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
    fieldName: 'typeId',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'protocol',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'group',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'areaId',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'locationId',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'camera',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'signal',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (rData) => {
  global.spiderman.systemlog.writeInfo(
    `devicesele modify ${rData.uuid} ${rData.data.name}`,
  )

  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  })

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  })

  await global.domain.devicesele.modify({ uuid, ...data })

  global.spiderman.systemlog.writeInfo(
    `devicesele modify ${rData.uuid} ${rData.data.name}`,
  )

  return {
    message: 'ok',
  }
}
