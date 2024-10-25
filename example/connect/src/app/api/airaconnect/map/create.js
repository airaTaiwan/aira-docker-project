const fieldChecks = [
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

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`env map create ${data.name}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  await global.domain.map.create(data)

  global.spiderman.systemlog.writeInfo(`env map create ${data.name}`)

  return {
    message: 'ok',
  }
}
