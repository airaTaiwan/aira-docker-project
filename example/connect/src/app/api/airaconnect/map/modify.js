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
    fieldName: 'imageName',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'mapFile',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'area',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'pin',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'enabled',
    fieldType: 'boolean',
    required: false,
  },
]

module.exports = async (rData) => {
  global.spiderman.systemlog.writeInfo(
    `map modify ${rData.uuid} ${rData.data.name}`,
  )

  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  })

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  })

  await global.domain.map.modify({ uuid, ...data })

  global.spiderman.systemlog.writeInfo(`map modify ${rData.uuid}`)

  return {
    message: 'ok',
  }
}
