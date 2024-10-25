const fieldChecks = [
  {
    fieldName: 'typeId',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'name',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'remark',
    fieldType: 'string',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`devicetype create ${data.typeId}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  // optional paramters set default value
  if (!data.remarks)
    data.remarks = ''

  // if (data.typeId.length === 0) {
  //   global.spiderman.systemlog.writeError('Name cannot be empty.');
  //   throw Error('Name cannot be empty.');
  // }

  await global.domain.devicetype.create(data)

  global.spiderman.systemlog.writeInfo(`devicetype create ${data.typeId}`)

  return {
    message: 'ok',
  }
}
