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
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'actionType',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'enable',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'targetType',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'targetList',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'remark',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'notify',
    fieldType: 'object',
    required: false,
  },
  {
    fieldName: 'condition',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'specifyTime',
    fieldType: 'object',
    required: false,
  },
  {
    fieldName: 'weeklySchedule',
    fieldType: 'object',
    required: false,
  },
]

const lineFieldChecks = [
  {
    fieldName: 'token',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'language',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'data_list',
    fieldType: 'object',
    required: true,
  },
  {
    fieldName: 'note',
    fieldType: 'string',
    required: false,
  },
]

const httpFieldChecks = [
  {
    fieldName: 'https',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'method',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'user',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'pass',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'host',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'data_type',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'url',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'custom_data',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'note',
    fieldType: 'string',
    required: false,
  },
]

const mailFieldChecks = [
  {
    fieldName: 'method',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'secure',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'from',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'user',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'pass',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'host',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'language',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'subject',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'to',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'cc',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'bcc',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'data_list',
    fieldType: 'object',
    required: true,
  },
  {
    fieldName: 'note',
    fieldType: 'string',
    required: false,
  },
]

const wiegandFieldChecks = [
  {
    fieldName: 'host',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'bits',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'index',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'syscode',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'special_card_number',
    fieldType: 'string',
    required: false,
  },
]

const ioboxFieldChecks = [
  {
    fieldName: 'brand',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'model',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'host',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'user',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'pass',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'iopoint',
    fieldType: 'array',
    required: true,
  },
]

// const iopointFieldChecks = [
//   {
//     fieldName: 'no',
//     fieldType: 'number',
//     required: true,
//   },
//   {
//     fieldName: 'enable',
//     fieldType: 'boolean',
//     required: true,
//   },
//   {
//     fieldName: 'default',
//     fieldType: 'boolean',
//     required: true,
//   },
//   {
//     fieldName: 'trigger',
//     fieldType: 'boolean',
//     required: true,
//   },
//   {
//     fieldName: 'delay',
//     fieldType: 'number',
//     required: true,
//   },
// ];

module.exports = async (rData) => {
  global.spiderman.systemlog.writeInfo(`eventhandle find ${rData}`)

  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  })

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  })

  /* const { action_type: actionType } = rData.data;
  let data;
  if (actionType === 'line') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...lineFieldChecks],
    });
  } else if (actionType === 'http') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...httpFieldChecks],
    });
  } else if (actionType === 'mail') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...mailFieldChecks],
    });
  } else if (actionType === 'wiegand') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...wiegandFieldChecks],
    });
  } else if (actionType === 'iobox') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...ioboxFieldChecks],
    });
  } else {
    global.spiderman.systemlog.writeError('action_type error.');
    throw Error('action_type error.');
  } */

  await global.domain.eventhandle.modify({ uuid, data })

  global.spiderman.systemlog.writeInfo(
    `eventhandle modify ${data.action_type} ${data.name}`,
  )

  return {
    message: 'ok',
  }
}
