module.exports = () => {
  const { db } = global.spiderman

  async function find({ uuid, typeId, sliceShift, sliceLength }) {
    if (!Array.isArray(uuid))
      uuid = []
    if (!Array.isArray(typeId))
      typeId = []
    if (sliceShift == undefined)
      sliceShift = 0
    if (sliceLength == undefined)
      sliceLength = Number.MAX_SAFE_INTEGER

    global.spiderman.systemlog.writeInfo(
      `domain devicetype find ${uuid} ${typeId}`,
    )

    const { totalLength, result } = await global.domain.crud.find({
      collection: 'devicetype',
      query: {
        uuid: uuid.length <= 0 ? {} : { $in: uuid },
        typeId: typeId.length <= 0 ? {} : { $in: typeId },
      },
      sliceShift,
      sliceLength,
    })

    return {
      total_length: totalLength,
      list: result,
    }
  }

  async function create({ uuid, typeId, name, remark }) {
    global.spiderman.systemlog.writeInfo(
      `domain devicetype create ${typeId} ${name}`,
    )

    const fixedUuids = ['1', '2', '3', '4']
    if (fixedUuids.includes(uuid))
      throw new Error('The item can not be change.')

    let doesExist = false
    doesExist = !!db.devicetype.findOne({ typeId })
    if (doesExist)
      throw new Error(`The item <${typeId}> has already existed.`)

    doesExist = !!db.devicetype.findOne({ name })
    if (doesExist)
      throw new Error(`The item <${name}> has already existed.`)

    await global.domain.crud.insertOne({
      collection: 'devicetype',
      data: { typeId, name, remark },
    })
  }

  async function modify({ uuid, typeId, name, remark }) {
    global.spiderman.systemlog.writeInfo(`domain devicetype modify ${uuid}`)

    const fixedUuids = ['1', '2', '3', '4']
    if (fixedUuids.includes(uuid))
      throw new Error('The item can not be change.')

    let doesExist = false
    doesExist = !!db.devicetype.findOne({ typeId, uuid: { $ne: uuid } })
    if (doesExist)
      throw new Error(`The item <${typeId}> has already existed.`)

    doesExist = !!db.devicetype.findOne({ name, uuid: { $ne: uuid } })
    if (doesExist)
      throw new Error(`The item <${name}> has already existed.`)

    await global.domain.crud.modify({
      collection: 'devicetype',
      uuid,
      data: { typeId, name, remark },
    })
  }

  async function remove({ uuid, typeId }) {
    if (!Array.isArray(uuid))
      uuid = []

    global.spiderman.systemlog.writeInfo(`domain devicetype remove ${uuid}`)

    // const fixedUuids = ['0', '1'];
    // uuid = uuid.filter((item) => !fixedUuids.includes(item));

    db.devicetype.deleteMany({ uuid: uuid.length <= 0 ? {} : { $in: uuid } })
  }

  return {
    find,
    create,
    modify,
    remove,
  }
}
