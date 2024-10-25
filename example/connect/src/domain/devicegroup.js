module.exports = () => {
  const { db } = global.spiderman

  async function find({ uuid, sliceShift, sliceLength }) {
    if (!Array.isArray(uuid))
      uuid = []
    if (sliceShift == undefined)
      sliceShift = 0
    if (sliceLength == undefined)
      sliceLength = Number.MAX_SAFE_INTEGER

    global.spiderman.systemlog.writeInfo(`domain devicegroup find ${uuid}`)

    const { totalLength, result } = await global.domain.crud.find({
      collection: 'devicegroup',
      query: { uuid: uuid.length <= 0 ? {} : { $in: uuid } },
      sliceShift,
      sliceLength,
    })

    return {
      total_length: totalLength,
      list: result,
    }
  }

  async function create(data) {
    global.spiderman.systemlog.writeInfo(
      `domain devicegroup create ${data.name}`,
    )

    // let doesExist = false;

    // doesExist = !!db.devicegroup.findOne({ uuid: data.uuid });
    // if (doesExist) throw Error(`The item <${name}> has already existed.`);

    await global.domain.crud.insertOne({
      collection: 'devicegroup',
      data,
    })
  }

  async function modify(data) {
    global.spiderman.systemlog.writeInfo(
      `domain devicegroup modify ${data.uuid}`,
    )

    let doesExist = false

    doesExist = !!db.devicegroup.findOne({ uuid: data.uuid })
    if (!doesExist)
      throw new Error(`The item <${data.uuid}> not existed.`)

    await global.domain.crud.modify({
      collection: 'devicegroup',
      uuid: data.uuid,
      data,
    })
  }

  async function remove({ uuid }) {
    if (!Array.isArray(uuid))
      uuid = []
    if (uuid.length <= 0)
      throw new Error('uuid cannot be an empty array.')

    global.spiderman.systemlog.writeInfo(`domain , typeId remove ${uuid}`)

    // const fixedUuids = ['0', '1'];
    // uuid = uuid.filter((item) => !fixedUuids.includes(item));

    db.devicegroup.deleteMany({ uuid: { $in: uuid } })
  }

  return {
    find,
    create,
    modify,
    remove,
  }
}
