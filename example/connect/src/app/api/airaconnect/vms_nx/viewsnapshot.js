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
    fieldType: 'string',
    required: false,
  },
]

module.exports = async (data, tokenUser, res) => {
  global.spiderman.systemlog.writeInfo(
    `vms_nx viewsnapshot ${JSON.stringify(data)}`,
  )

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  if (!data.host)
    data = { ...data, ...global.params.vms }

  const list = await global.domain.workerNx.viewsnapshot(
    data.host,
    data.port,
    data.username,
    data.password,
    data.authorization,
    { cameraId: data.camera_id, timeStamp: data.timestamp, res },
  )

  // const ret = {
  //   message: 'ok',
  //   data_list: list.data || {},
  // };

  // global.spiderman.systemlog.writeInfo(`vms_nx viewsnapshot ${JSON.stringify(ret)}`);

  // return ret;
}
