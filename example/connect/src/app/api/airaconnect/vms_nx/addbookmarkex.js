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
  {
    fieldName: 'camera_id',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'timestamp',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'caption',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'description',
    fieldType: 'string',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(
    `vms_nx addbookmarkex ${JSON.stringify(data)}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  if (!data.host)
    data = { ...data, ...global.params.vms }

  const list = await global.domain.workerNx.addbookmarkex(
    data.host,
    data.port,
    data.username,
    data.password,
    data.authorization,
    {
      cameaId: data.camera_id,
      timestamp: data.timestamp,
      caption: data.caption,
      description: data.description,
    },
  )

  const ret = {
    message: 'ok',
    data_list: list.data || [],
  }

  global.spiderman.systemlog.writeInfo(
    `vms_nx addbookmarkex ${JSON.stringify(ret)}`,
  )

  return ret
}
