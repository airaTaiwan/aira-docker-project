const { reject } = require('lodash')
const { resolve } = require('mongodb/lib/core/topologies/read_preference')

module.exports = () => {
  // const { workerMongo } = global.domain;

  async function findDeviceRowMeta({
    collection,
    start_time,
    end_time,
    deviceId,
    slice_shift,
    slice_length,
  }) {
    global.spiderman.systemlog.writeInfo(
      `domain report findDeviceRowMeta ${start_time} ${end_time} ${deviceId}`,
    )

    const query = { timestamp: { $gte: start_time, $lt: end_time } }

    if (deviceId.length >= 1) {
      query.deviceId = { $in: deviceId }
    }

    const { totalLength, result } = await new Promise((resolve, reject) => {
      global.domain.workerMongo.find(
        collection,
        query,
        { timestamp: -1 },
        { slice_shift, slice_length },
        (err, records) => {
          if (err) {
            resolve({
              totalLength: 0,
              result: [],
            })
            throw new Error(err)
          }
          else {
            resolve({
              totalLength: records.total_length,
              result: records.data,
            })
          }
        },
      )
    })

    return {
      total_length: totalLength,
      list: result,
    }
  }

  async function findDeviceRowEventStat({
    collection,
    dateCode,
    deviceId,
    slice_shift,
    slice_length,
  }) {
    global.spiderman.systemlog.writeInfo(
      `domain report findDeviceRowEventStat ${dateCode} ${deviceId}`,
    )

    const query = { dateCode: { $in: dateCode } }

    if (deviceId.length >= 1) {
      query.deviceId = { $in: deviceId }
    }

    const { totalLength, result } = await new Promise((resolve, reject) => {
      global.domain.workerMongo.find(
        collection,
        query,
        { dateCode: 1, deviceId: 1 },
        { slice_shift, slice_length },
        (err, records) => {
          if (err) {
            resolve({
              totalLength: 0,
              result: [],
            })
            throw new Error(err)
          }
          else {
            resolve({
              totalLength: records.total_length,
              result: records.data,
            })
          }
        },
      )
    })

    return {
      total_length: totalLength,
      list: result,
    }
  }

  return {
    findDeviceRowMeta,
    findDeviceRowEventStat,
  }
}
