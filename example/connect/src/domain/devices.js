module.exports = (deviceType) => {
  const { db } = global.spiderman
  const { _ } = global.spiderman

  let collection = ''
  let defaultGroupId = ''
  switch (deviceType) {
    case 'mac':
      collection = 'devicesmac'
      defaultGroupId = 'All Machinery'
      break
    case 'air':
      collection = 'devicesair'
      defaultGroupId = 'All AirCompressor'
      break
    case 'ele':
      collection = 'devicesele'
      defaultGroupId = 'All ElectricMeter'
      break
    case 'gate':
      collection = 'devicesgate'
      defaultGroupId = ''
      break
    case 'comm':
      collection = 'devicescomm'
      defaultGroupId = ''
      break
    case 'env':
      collection = 'devicesenv'
      defaultGroupId = 'All Environmental'
      break
  }

  async function addDeviceToGroup(group, uuid) {
    group.list = [...new Set([...group.list, uuid])]
    await global.domain.crud.modify({
      collection: 'devicegroup',
      uuid: group.uuid,
      data: group,
    })
  }

  async function removeDeviceFromGroup(group, uuid) {
    const deviceList = new Set(group.list)
    deviceList.delete(uuid)
    group.list = [...deviceList]
    await global.domain.crud.modify({
      collection: 'devicegroup',
      uuid: group.uuid,
      data: group,
    })
  }

  async function syncDeviceLists(
    uuid,
    newGroupIds = [],
    oldGroupIds = undefined,
  ) {
    const toBeAdded
      = typeof oldGroupIds === 'undefined'
        ? newGroupIds
        : _.difference(newGroupIds, oldGroupIds)
    for (const groupId of toBeAdded) {
      const group = db.devicegroup.findOne({ uuid: groupId })
      if (!group)
        continue
      try {
        await addDeviceToGroup(group, uuid)
      }
      catch {}
    }
    const toBeRemoved
      = typeof oldGroupIds === 'undefined'
        ? []
        : _.difference(oldGroupIds, newGroupIds)
    for (const groupId of toBeRemoved) {
      const group = db.devicegroup.findOne({ uuid: groupId })
      if (!group)
        continue
      try {
        await removeDeviceFromGroup(group, uuid)
      }
      catch {}
    }
  }

  async function find({ uuid, deviceId, sliceShift, sliceLength }) {
    if (!Array.isArray(uuid))
      uuid = []
    if (!Array.isArray(deviceId))
      deviceId = []
    if (sliceShift == undefined)
      sliceShift = 0
    if (sliceLength == undefined)
      sliceLength = 100

    global.spiderman.systemlog.writeInfo(
      `domain ${collection} find ${uuid} ${deviceId}`,
    )

    const { totalLength, result } = await global.domain.crud.find({
      collection,
      query: {
        uuid: uuid.length <= 0 ? {} : { $in: uuid },
        deviceId: deviceId.length <= 0 ? {} : { $in: deviceId },
      },
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

  async function create(data) {
    global.spiderman.systemlog.writeInfo(
      `domain ${collection} create ${data.deviceId} ${data.name}`,
    )

    let doesExist = false
    doesExist = !!db[collection].findOne({ uuid: data.uuid })
    if (doesExist)
      throw new Error(`The item <${data.uuid}> has already existed.`)
    // doesExist = !!db[collection].findOne({ name: data.name });
    // if (doesExist) throw Error(`The item <${data.name}> has already existed.`);

    // const typeId = !!db.devicetype.findOne({ typeId: data.typeId });
    // if (!typeId) throw Error(`The item <${data.typeId}> does not existed.`);
    if (defaultGroupId)
      data.group = [...new Set([...data.group, defaultGroupId])]
    const inserted = await global.domain.crud.insertOne({
      collection,
      data,
    })
    await syncDeviceLists(inserted.uuid, data.group)
  }

  async function modify(data) {
    global.spiderman.systemlog.writeInfo(
      `domain ${collection} modify ${data.uuid}`,
    )
    const original = db[collection].findOne({ uuid: data.uuid })
    if (!original)
      throw new Error(`The item <${data.uuid}> does not exist.`)
    // const fixedUuids = ['0', '1'];
    // if (fixedUuids.includes(data.uuid)) throw Error('The item can not be change.');

    // let doesExist = false;
    // doesExist = !!db[collection].findOne({ deviceId: data.deviceId, uuid: { $ne: data.uuid } });
    // if (doesExist) throw Error(`The item <${data.deviceId}> has already existed.`);

    // doesExist = !!db[collection].findOne({ name: data.name, uuid: { $ne: data.uuid } });
    // if (doesExist) throw Error(`The item <${data.name}> has already existed.`);

    // const typeId = !!db.devicetype.findOne({ typeId: data.typeId });
    // if (!typeId) throw Error(`The item <${data.typeId}> does not existed.`);
    if (defaultGroupId)
      data.group = [...new Set([...data.group, defaultGroupId])]
    await global.domain.crud.modify({
      collection,
      uuid: data.uuid,
      data,
    })
    await syncDeviceLists(data.uuid, data.group, original.group)
  }

  async function remove({ uuid }) {
    if (!Array.isArray(uuid))
      uuid = []
    if (uuid.length <= 0)
      throw new Error('uuid cannot be an empty array.')
    global.spiderman.systemlog.writeInfo(`domain ${collection} remove ${uuid}`)
    // const fixedUuids = ['0', '1'];
    // uuid = uuid.filter((item) => !fixedUuids.includes(item));
    const devices = db[collection].find({ uuid: { $in: uuid } })
    db[collection].deleteMany({ uuid: { $in: uuid } })
    for (const { uuid, group } of devices) {
      await syncDeviceLists(uuid, [], group)
    }
  }

  return {
    find,
    create,
    modify,
    remove,
  }
}
