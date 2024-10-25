const fieldChecks = [
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

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`env devicesair create ${data.deviceId}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.devicesair.create(data)

  global.spiderman.systemlog.writeInfo(`env devicesair create ${data.deviceId}`)

  return {
    message: 'ok',
  }
}
