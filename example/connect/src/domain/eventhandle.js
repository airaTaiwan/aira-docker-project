const { uuid: uuidv4 } = require('uuidv4')

module.exports = () => {
  async function find({ uuid, actionType, sliceShift, sliceLength }) {
    global.spiderman.systemlog.writeInfo(
      `domain eventhandle find ${uuid}, ${actionType}, ${sliceShift}, ${sliceLength}`,
    )

    const { totalLength, result } = await global.domain.crud.find({
      collection: 'eventhandle',
      query: {
        ...(!uuid ? {} : { uuid }),
        ...(!actionType ? {} : { action_type: { $in: actionType } }),
      },
      sliceShift,
      sliceLength,
    })

    return {
      totalLength,
      result,
    }
  }

  function create(data) {
    global.spiderman.systemlog.writeInfo(
      `domain eventhandle create ${JSON.stringify(data)}`,
    )

    const repeatItem = global.domain.crud.find({
      collection: 'eventhandle',
      query: { uuid: data.uuid },
      sliceShift: 0,
      sliceLength: 10000,
    })

    if (repeatItem.totalLength >= 1) {
      global.spiderman.systemlog.writeError('Name existed. type: eventhandle')
      throw new Error('Name existed. type: eventhandle')
    }

    data.uuid = uuidv4()
    global.domain.crud.insertOne({
      collection: 'eventhandle',
      data,
      uniqueKeys: ['uuid'],
    })
  }

  async function modify({ uuid, data }) {
    global.spiderman.systemlog.writeInfo(
      `domain eventhandle modify ${uuid} ${JSON.stringify(data)}`,
    )

    const repeatItem = global.domain.crud.find({
      collection: 'eventhandle',
      query: { uuid: { $ne: uuid } },
      sliceShift: 0,
      sliceLength: 10000,
    })

    if (!repeatItem) {
      global.spiderman.systemlog.writeError('Uuid not found. type: eventhandle')
      throw new Error('Uuid not found. type: eventhandle')
    }

    global.domain.crud.modify({
      collection: 'eventhandle',
      uuid,
      data,
    })
  }

  function remove({ uuid }) {
    global.spiderman.systemlog.writeInfo(`domain eventhandle remove ${uuid}`)

    const repeatItem = global.domain.crud.find({
      collection: 'eventhandle',
      query: { uuid },
      sliceShift: 0,
      sliceLength: 10000,
    })
    if (!repeatItem) {
      global.spiderman.systemlog.writeError('Item not found.')
      throw new Error('Item not found.')
    }

    global.domain.crud.remove({ collection: 'eventhandle', uuid })
  }

  return {
    find,
    create,
    modify,
    remove,
  }
}
