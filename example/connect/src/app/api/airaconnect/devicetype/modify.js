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

module.exports = async (rData) => {
  global.spiderman.systemlog.writeInfo(
    `devicetype modify ${rData.uuid} ${rData.typeId}`,
  )

  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  })

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  })

  await global.domain.devicetype.modify({ uuid, ...data })

  global.spiderman.systemlog.writeInfo(
    `devicetype modify ${rData.uuid} ${rData.typeId}`,
  )

  return {
    message: 'ok',
  }
}
