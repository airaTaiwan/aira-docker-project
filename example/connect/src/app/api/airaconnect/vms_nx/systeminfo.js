const fieldChecks = [
  {
    fieldName: 'host',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'username',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'password',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'authorization',
    fieldType: 'string',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `vms_nx systeminfo ${JSON.stringify(data)}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  if (!data.host)
    data = { ...data, ...global.params.vms }

  const info = await global.domain.workerNx.getSysteminfo(
    data.host,
    data.port,
    data.username,
    data.password,
    data.authorization,
  )

  const ret = {
    message: 'ok',
    settings: info.data || {},
  }

  global.spiderman.systemlog.writeInfo(
    `vms_nx systeminfo ${JSON.stringify(ret)}`,
  )

  return ret
}
