module.exports = (deviceType) => {
  const { db, _ } = global.spiderman

  async function find({ uuid, sliceShift, sliceLength }) {
    if (!Array.isArray(uuid))
      uuid = []
    if (sliceShift == undefined)
      sliceShift = 0
    if (sliceLength == undefined)
      sliceLength = 100

    global.spiderman.systemlog.writeInfo(`domain map find ${uuid}`)

    const { totalLength, result } = await global.domain.crud.find({
      collection: 'map',
      query: { uuid: uuid.length <= 0 ? {} : { $in: uuid } },
      sliceShift,
      sliceLength,
    })

    return {
      total_length: totalLength,
      slice_shift: sliceShift,
      slice_length: sliceLength,
      list: result,
    }
  }

  async function updateDeviceAreaId(device, areaId = '') {
    device.areaId = areaId
    await global.domain.crud.modify({
      collection: `devices${device.typeId}`,
      uuid: device.uuid,
      data: device,
    })
  }

  async function syncDeviceAreaId(newPins = [], oldPins = undefined) {
    const toBeRemoved = typeof oldPins === 'undefined' ? [] : oldPins
    for (const { type, uuid: deviceId } of toBeRemoved) {
      const device = db[`devices${type}`].findOne({ uuid: deviceId })
      if (!device)
        continue
      try {
        await updateDeviceAreaId(device, '')
      }
      catch {}
    }
    const toBeAdded = newPins
    for (const { type, uuid: deviceId, area: areaId } of toBeAdded) {
      const device = db[`devices${type}`].findOne({ uuid: deviceId })
      if (!device)
        continue
      try {
        await updateDeviceAreaId(device, areaId)
      }
      catch {}
    }
  }

  async function create(data) {
    global.spiderman.systemlog.writeInfo(`domain map create ${data.name}`)

    let doesExist = false
    doesExist = !!db.map.findOne({ uuid: data.uuid })
    if (doesExist)
      throw new Error(`The item <${data.uuid}> has already existed.`)

    await global.domain.crud.insertOne({
      collection: 'map',
      data,
    })
    await syncDeviceAreaId(data.pin)
  }

  async function modify(data) {
    global.spiderman.systemlog.writeInfo(`domain map modify ${data.uuid}`)

    // const fixedUuids = ['0', '1'];
    // if (fixedUuids.includes(data.uuid)) throw Error('The item can not be change.');
    const original = db.map.findOne({ uuid: data.uuid })
    if (!original)
      throw new Error(`The item <${data.uuid}> does not exist.`)

    await global.domain.crud.modify({
      collection: 'map',
      uuid: data.uuid,
      data,
    })
    await syncDeviceAreaId(data.pin, original.pin)
  }

  async function remove({ uuid }) {
    if (!Array.isArray(uuid))
      uuid = []
    if (uuid.length <= 0)
      throw new Error('uuid cannot be an empty array.')

    global.spiderman.systemlog.writeInfo(`domain map remove ${uuid}`)

    // const fixedUuids = ['0', '1'];
    // uuid = uuid.filter((item) => !fixedUuids.includes(item));
    const maps = db.map.find({ uuid: { $in: uuid } })
    db.map.deleteMany({ uuid: { $in: uuid } })
    for (const map of maps) await syncDeviceAreaId([], map.pin)
  }

  return {
    find,
    create,
    modify,
    remove,
  }
}
