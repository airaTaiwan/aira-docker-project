const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'list',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'created',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'remark',
    fieldType: 'string',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`devicegroup create ${data.name}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  // optional paramters set default value
  if (!data.remark)
    data.remark = ''

  // if (data.typeId.length === 0) {
  //   global.spiderman.systemlog.writeError('Name cannot be empty.');
  //   throw Error('Name cannot be empty.');
  // }

  await global.domain.devicegroup.create(data)

  global.spiderman.systemlog.writeInfo(`devicegroup create ${data.name}`)

  return {
    message: 'ok',
  }
}
