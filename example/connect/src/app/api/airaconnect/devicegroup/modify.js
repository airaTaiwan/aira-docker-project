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
    required: false,
  },
  {
    fieldName: 'remark',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'list',
    fieldType: 'array',
    required: false,
  },
]

module.exports = async (rData) => {
  global.spiderman.systemlog.writeInfo(`devicegroup modify ${rData.uuid}`)

  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  })

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  })

  await global.domain.devicegroup.modify({ uuid, ...data })

  global.spiderman.systemlog.writeInfo(`devicegroup modify ${rData.uuid}`)

  return {
    message: 'ok',
  }
}
