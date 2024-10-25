const { reject } = require('lodash')
const { resolve } = require('mongodb/lib/core/topologies/read_preference')
const { uuid } = require('uuidv4')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function getTides(db, now, location) {
  const reports = await db
    .collection('OpenDataTideHeights')
    .find({
      timestamp: {
        $gte: now,
      },
      location,
    })
    .sort({
      timestamp: 1,
    })
    .limit(2)
    .toArray()
  if (!reports.length)
    return [null, null]
  return reports.map(report => ({
    time: report.timestamp,
    tide: report.tide,
    tideHeight: report.tideHeight,
  }))
}

async function getHeatInjuryIndex(db, now, county, town) {
  const location = `${county}${town}`
  const [report] = await db
    .collection('OpenDataHeatInjuryIndexes')
    .find({
      timestamp: {
        $gte: now,
      },
      location,
    })
    .sort({
      timestamp: 1,
    })
    .limit(1)
    .toArray()
  if (!report)
    return 0
  return report.index
}

async function getPast24hrPrecipitation(db, now, stationId) {
  const [report] = await db
    .collection('OpenDataCumulativeRainfallAmounts')
    .find({
      timestamp: {
        $lte: now,
      },
      stationId,
    })
    .sort({
      timestamp: -1,
    })
    .limit(1)
    .toArray()
  if (!report)
    return 0
  return report.precipitation
}

async function getPast1hrPrecipitation(db, now, stationId) {
  const [report] = await db
    .collection('OpenDataHourlyRainfallAmounts')
    .find({
      timestamp: {
        $lte: now,
      },
      stationId,
    })
    .sort({
      timestamp: -1,
    })
    .limit(1)
    .toArray()
  if (!report)
    return 0
  return report.precipitation
}

async function getLatestWaterLevels(db, serialNumbers) {
  const results = await Promise.all(
    serialNumbers.map(serialNumber =>
      db
        .collection('JuiFengWaterLevels')
        .find({ sn: serialNumber })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray(),
    ),
  )
  const reports = []
  for (const [report] of results) {
    if (!report)
      continue
    const { sn, value, timestamp } = report
    reports.push({ sn, value, timestamp })
  }
  return reports
}

module.exports = () => {
  let server = null
  let conn = null
  let timeoutId = -1
  const timeMaintainConn = 10000

  async function onSendingHSData(socket) {
    const db = conn.db(global.params.mongodb.db)
    const serialNumbers = process.env.JUIFENG_MONITORING_DEVICES.split(',').map(
      serialNumber => serialNumber.trim(),
    )
    const reports = await getLatestWaterLevels(db, serialNumbers)
    for (const report of reports) socket.send(JSON.stringify(report))
  }

  async function onSendingOpenData(socket) {
    const db = conn.db(global.params.mongodb.db)
    const now = Date.now()
    const county = process.env.OPEN_DATA_COUNTY
    const town = process.env.OPEN_DATA_TOWN
    const location = process.env.WALRUS_MONITORING_STATION_LOCATION
    const stationId = process.env.OPEN_DATA_WEATHER_STATION_ID
    const past24hrPrecipitation = await getPast24hrPrecipitation(
      db,
      now,
      stationId,
    )
    const past1hrPrecipitation = await getPast1hrPrecipitation(
      db,
      now,
      stationId,
    )
    const heatInjuryIndex = await getHeatInjuryIndex(db, now, county, town)
    const tides = await getTides(db, now, location)
    socket.send(
      JSON.stringify({
        past24hrPrecipitation,
        past1hrPrecipitation,
        heatInjuryIndex,
        tides,
      }),
    )
  }

  function init() {
    // console.log('mongo workder init 1');

    if (timeoutId >= 0) {
      // console.log('mongo workder clearTimeout');
      clearTimeout(timeoutId)
      timeoutId = -1
    }

    server = global.spiderman.mongo.connect({
      url: global.params.mongodb.url,
      host: global.params.mongodb.ip,
      port: global.params.mongodb.port,
      user: global.params.mongodb.user,
      pass: global.params.mongodb.pass,
      onConnect: (client) => {
        console.log('mongo workder onConnect')

        conn = client
        global.spiderman.eventEmitter.on('connect', ({ socket, url }) => {
          if (!url.endsWith('devicestatus'))
            return
          onSendingOpenData(socket)
          setInterval(() => onSendingOpenData(socket), 15000)
        })
        global.spiderman.eventEmitter.on('connect', ({ socket, url }) => {
          if (!url.endsWith('devicestatus'))
            return
          onSendingHSData(socket)
          setInterval(() => onSendingHSData(socket), 15000)
        })

        initialDatabase((err, db) => {
          // defaultData();
        })

        // if (timeoutId >= 0) {
        //     // console.log('mongo workder clearTimeout');
        //     clearTimeout(timeoutId);
        //     timeoutId = -1;
        // }

        // timeoutId = setTimeout(
        //   () => {
        //     databaseMaintenance();
        //   },
        //   (60 - new Date().getSeconds()) * 1000,
        // );
      },
      onClose: (client) => {
        console.log('mongo workder onClose')
        conn = null

        // if (timeoutId >= 0) {
        //     // console.log('mongo workder clearTimeout');
        //     clearTimeout(timeoutId);
        //     timeoutId = -1;
        // }

        timeoutId = setTimeout(() => {
          // console.log('maintainConnection start');
          maintainConnection()
        }, timeMaintainConn)
      },
      onError: (client, err) => {
        // console.log('mongo workder onError', err);
        console.log('mongo workder onError')
        conn = null

        // if (timeoutId >= 0) {
        //     // console.log('mongo workder clearTimeout');
        //     clearTimeout(timeoutId);
        //     timeoutId = -1;
        // }

        timeoutId = setTimeout(() => {
          // console.log('maintainConnection start');
          maintainConnection()
        }, timeMaintainConn)
      },
    })
  }

  function initialDatabase(callback) {
    console.log('mongo workder initialDatabase')

    try {
      conn
        .db('admin')
        .admin()
        .listDatabases((err, dbs) => {
          if (err == null) {
            // database is exist
            let newDB = dbs.databases.find(
              item => item.name == global.params.mongodb.db,
            )

            if (!newDB) {
              // Create new database
              newDB = conn.db(global.params.mongodb.db)

              // create new user collection
              // newDB.createCollection("_User");
            }
            else {
              // switch to database
              newDB = conn.db(global.params.mongodb.db)
            }

            if (callback)
              callback(null, newDB)
          }
        })
    }
    catch (ex) {
      if (callback)
        callback(ex, null)
    }
  }

  async function initialCollection(_collection) {
    let result = false

    try {
      const cols = await conn
        .db(global.params.mongodb.db)
        .listCollections()
        .toArray()
      const newCol = cols.find(item => item.name == _collection)

      if (!newCol) {
        conn.db(global.params.mongodb.db).createCollection(_collection)
      }

      result = true
    }
    catch (ex) {}

    return result
  }

  async function createIndex(_collection, _specification, _options) {
    await conn
      .db(global.params.mongodb.db)
      .collection(_collection)
      .createIndex(_specification, _options)
  }

  async function defaultData() {
    // const { defaultdata } = global.spiderman;
    const ttlExpire = 5184000 // 86400 * 30 * 2; 60 days

    // if (await initialCollection('_User')) {
    //     defaultdata.account.forEach(a => {
    //         findOne('_User', { username: a.username }, (err, result) => {
    //             // console.log('', err, result);
    //         });
    //     });
    // }

    if (await initialCollection('DeviceRow')) {
      // defaultdata.account.forEach(a => {
      //     find('DeviceRow', {}, { page: 1, pageSize: 2 }, (err, result) => {
      //         // console.log('', err, result);
      //     });
      // });
    }
    await createIndex(
      'DeviceRow',
      { lastModifiedDate: 1 },
      { expireAfterSeconds: ttlExpire },
    )
  }

  async function maintainConnection() {
    if (timeoutId >= 0) {
      clearTimeout(timeoutId)
      timeoutId = -1
    }

    if (conn == null) {
      init()
    }
  }

  async function databaseMaintenance() {
    const cycleSec = 300

    if (timeoutId >= 0) {
      clearTimeout(timeoutId)
      timeoutId = -1
    }

    try {
      await collectionHouseKeeper()
      await databaseReclaiming()
    }
    catch (ex) {
      conn = null

      timeoutId = setTimeout(() => {
        maintainConnection()
      }, timeMaintainConn)
    }

    if (timeoutId == -1) {
      const d = new Date()
      let s = d.getMinutes() * 60 + d.getSeconds()
      s %= cycleSec

      timeoutId = setTimeout(
        () => {
          databaseMaintenance()
        },
        (cycleSec - s) * 1000,
      )
    }
  }

  async function collectionHouseKeeper() {
    // await delay(3000);
  }

  async function databaseReclaiming() {
    // await delay(5000);

    const databasesList = await conn.db().admin().listDatabases()
    for (const dbName of databasesList.databases.map(db => db.name)) {
      const collections = await conn.db(dbName).listCollections().toArray()
      collections.forEach((c) => {
        if (c.name != 'system') {
          conn
            .db(dbName)
            .command({ compact: c.name, force: true }, (err, result) => {
              if (err)
                console.log('err 2', err)
              // console.log("databaseReclaiming result", result);
            })
        }
      })
    }
  }

  async function find(
    _collection,
    _query,
    _sort,
    _options = {},
    callback = null,
  ) {
    // _options = { ..._options, ...{ page: 1, pageSize: 100 } };
    // _options.page = _options.page || 1;
    // _options.pageSize = _options.pageSize || 100;

    // let skip = (_options.page - 1) * _options.pageSize;
    // let limit = skip + _options.pageSize;

    const sort = _sort || {}
    const skip = _options.slice_shift
    const limit = _options.slice_length

    const ret = {
      slice_length: limit,
      slice_shift: skip,
    }

    try {
      const totalRecords = await conn
        .db(global.params.mongodb.db)
        .collection(_collection)
        .countDocuments(_query)
      ret.total_length = totalRecords

      conn
        .db(global.params.mongodb.db)
        .collection(_collection)
        .find(_query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray((err, result) => {
          if (err) {
            ret.data = []
            if (callback)
              callback(err, ret)
          }
          else {
            ret.data = result
            if (callback)
              callback(null, ret)
          }
        })
    }
    catch (ex) {
      console.log('000', ex)

      ret.data = []
      if (callback)
        callback(ex, ret)
    }
  }

  function findOne(_collection, _query, callback) {
    try {
      conn
        .db(global.params.mongodb.db)
        .collection(_collection)
        .findOne(_query)
        .then((ret) => {
          if (callback)
            callback(null, ret)
        })
    }
    catch (ex) {
      if (callback)
        callback(ex, null)
    }
  }

  function insertOne(_collection, _dataToUpdate, callback) {
    try {
      _dataToUpdate.lastModifiedDate = new Date()
      conn
        .db(global.params.mongodb.db)
        .collection(_collection)
        .insertOne(_dataToUpdate, {}, (err, doc) => {
          if (err) {
            if (callback)
              callback(err, null)
          }
          else {
            conn
              .db(global.params.mongodb.db)
              .collection(_collection)
              .find({ _id: doc.insertedId })
              .toArray((err, ret) => {
                if (err) {
                  if (callback)
                    callback(err, null)
                }
                else {
                  if (callback)
                    callback(err, ret)
                }
              })
          }
        })
    }
    catch (ex) {
      if (callback)
        callback(ex, null)
    }
  }

  function updateOne(_collection, _dataToUpdate, _condition, callback) {
    try {
      _dataToUpdate.lastModifiedDate = new Date()
      conn
        .db(global.params.mongodb.db)
        .collection(_collection)
        .updateOne(
          _condition,
          { $set: _dataToUpdate },
          { upsert: true },
          (err, doc) => {
            // result: { n: 1, upserted: [ { index: 0, _id: 6617b211162f9291036690c1 } ], nModified: 0, ok: 1 },
            // console.log("updateOne doc", doc.result);

            if (err) {
              if (callback)
                callback(err, null)
            }
            else {
              conn
                .db(global.params.mongodb.db)
                .collection(_collection)
                .find(_condition)
                .toArray((err, ret) => {
                  if (err) {
                    if (callback)
                      callback(err, null)
                  }
                  else {
                    if (callback)
                      callback(err, ret)
                  }
                })
            }
          },
        )
    }
    catch (ex) {
      if (callback)
        callback(ex, null)
    }
  }

  async function demographicMeta(_collection, _dataToUpdate, callback) {
    // {
    //     timestamp,
    //     dateCode: `${new Date(timestamp).getFullYear()}${('00' + (new Date(timestamp).getMonth() + 1)).slice(-2)}${('00' + new Date(timestamp).getDate()).slice(-2)}`,
    //     uuid: message.source_uuid,
    //     deviceId: message.algorithm_uuid,
    //     type: 'Counter',
    //     diff: cnt.concat(ages)
    // },

    return await new Promise(async (resolve, reject) => {
      // Counter
      let element = _dataToUpdate.diff[0] || 0
      try {
        _dataToUpdate.lastModifiedDate = new Date()
        const condition = {
          dateCode: _dataToUpdate.dateCode,
          uuid: _dataToUpdate.uuid,
          deviceId: _dataToUpdate.deviceId,
        }

        const query = { ...condition, ...{ type: 'Counter' } }
        const meta = await conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .findOne(query)
        const data
          = meta == null
            ? [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ]
            : meta.data

        data[new Date(_dataToUpdate.timestamp).getHours()] += element

        console.log('Counter data', data)

        conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .updateOne(
            query,
            { $set: { data } },
            { upsert: true },
            (err, doc) => {
              if (err) {
                if (callback)
                  callback(err, null)
              }
              else {
                conn
                  .db(global.params.mongodb.db)
                  .collection(_collection)
                  .find(query)
                  .toArray((err, ret) => {
                    if (err) {
                      if (callback)
                        callback(err, null)
                    }
                    else {
                      if (callback)
                        callback(err, ret)
                    }
                  })
              }
            },
          )
      }
      catch (ex) {
        if (callback)
          callback(ex, null)
      }

      // Male
      element = _dataToUpdate.diff[1] || 0
      try {
        _dataToUpdate.lastModifiedDate = new Date()
        const condition = {
          dateCode: _dataToUpdate.dateCode,
          uuid: _dataToUpdate.uuid,
          deviceId: _dataToUpdate.deviceId,
        }

        const query = { ...condition, ...{ type: 'Male' } }
        const meta = await conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .findOne(query)
        const data
          = meta == null
            ? [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ]
            : meta.data

        data[new Date(_dataToUpdate.timestamp).getHours()] += element

        conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .updateOne(
            query,
            { $set: { data } },
            { upsert: true },
            (err, doc) => {
              if (err) {
                if (callback)
                  callback(err, null)
              }
              else {
                conn
                  .db(global.params.mongodb.db)
                  .collection(_collection)
                  .find(query)
                  .toArray((err, ret) => {
                    if (err) {
                      if (callback)
                        callback(err, null)
                    }
                    else {
                      if (callback)
                        callback(err, ret)
                    }
                  })
              }
            },
          )
      }
      catch (ex) {
        if (callback)
          callback(ex, null)
      }

      // Female
      element = _dataToUpdate.diff[2] || 0
      try {
        _dataToUpdate.lastModifiedDate = new Date()
        const condition = {
          dateCode: _dataToUpdate.dateCode,
          uuid: _dataToUpdate.uuid,
          deviceId: _dataToUpdate.deviceId,
        }

        const query = { ...condition, ...{ type: 'Female' } }
        const meta = await conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .findOne(query)
        const data
          = meta == null
            ? [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ]
            : meta.data

        data[new Date(_dataToUpdate.timestamp).getHours()] += element

        conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .updateOne(
            query,
            { $set: { data } },
            { upsert: true },
            (err, doc) => {
              if (err) {
                if (callback)
                  callback(err, null)
              }
              else {
                conn
                  .db(global.params.mongodb.db)
                  .collection(_collection)
                  .find(query)
                  .toArray((err, ret) => {
                    if (err) {
                      if (callback)
                        callback(err, null)
                    }
                    else {
                      if (callback)
                        callback(err, ret)
                    }
                  })
              }
            },
          )
      }
      catch (ex) {
        if (callback)
          callback(ex, null)
      }

      // Age-1
      element = _dataToUpdate.diff[3] || 0
      try {
        _dataToUpdate.lastModifiedDate = new Date()
        const condition = {
          dateCode: _dataToUpdate.dateCode,
          uuid: _dataToUpdate.uuid,
          deviceId: _dataToUpdate.deviceId,
        }

        const query = { ...condition, ...{ type: 'Age-1' } }
        const meta = await conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .findOne(query)
        const data
          = meta == null
            ? [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ]
            : meta.data

        data[new Date(_dataToUpdate.timestamp).getHours()] += element

        conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .updateOne(
            query,
            { $set: { data } },
            { upsert: true },
            (err, doc) => {
              if (err) {
                if (callback)
                  callback(err, null)
              }
              else {
                conn
                  .db(global.params.mongodb.db)
                  .collection(_collection)
                  .find(query)
                  .toArray((err, ret) => {
                    if (err) {
                      if (callback)
                        callback(err, null)
                    }
                    else {
                      if (callback)
                        callback(err, ret)
                    }
                  })
              }
            },
          )
      }
      catch (ex) {
        if (callback)
          callback(ex, null)
      }

      // Age-2
      element = _dataToUpdate.diff[4] || 0
      try {
        _dataToUpdate.lastModifiedDate = new Date()
        const condition = {
          dateCode: _dataToUpdate.dateCode,
          uuid: _dataToUpdate.uuid,
          deviceId: _dataToUpdate.deviceId,
        }

        const query = { ...condition, ...{ type: 'Age-2' } }
        const meta = await conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .findOne(query)
        const data
          = meta == null
            ? [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ]
            : meta.data

        data[new Date(_dataToUpdate.timestamp).getHours()] += element

        conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .updateOne(
            query,
            { $set: { data } },
            { upsert: true },
            (err, doc) => {
              if (err) {
                if (callback)
                  callback(err, null)
              }
              else {
                conn
                  .db(global.params.mongodb.db)
                  .collection(_collection)
                  .find(query)
                  .toArray((err, ret) => {
                    if (err) {
                      if (callback)
                        callback(err, null)
                    }
                    else {
                      if (callback)
                        callback(err, ret)
                    }
                  })
              }
            },
          )
      }
      catch (ex) {
        if (callback)
          callback(ex, null)
      }

      // Age-3
      element = _dataToUpdate.diff[5] || 0
      try {
        _dataToUpdate.lastModifiedDate = new Date()
        const condition = {
          dateCode: _dataToUpdate.dateCode,
          uuid: _dataToUpdate.uuid,
          deviceId: _dataToUpdate.deviceId,
        }

        const query = { ...condition, ...{ type: 'Age-3' } }
        const meta = await conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .findOne(query)
        const data
          = meta == null
            ? [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ]
            : meta.data

        data[new Date(_dataToUpdate.timestamp).getHours()] += element

        conn
          .db(global.params.mongodb.db)
          .collection(_collection)
          .updateOne(
            query,
            { $set: { data } },
            { upsert: true },
            (err, doc) => {
              if (err) {
                if (callback)
                  callback(err, null)
              }
              else {
                conn
                  .db(global.params.mongodb.db)
                  .collection(_collection)
                  .find(query)
                  .toArray((err, ret) => {
                    if (err) {
                      if (callback)
                        callback(err, null)
                    }
                    else {
                      if (callback)
                        callback(err, ret)
                    }
                  })
              }
            },
          )
      }
      catch (ex) {
        if (callback)
          callback(ex, null)
      }

      resolve(true)
    })
  }

  function getClient() {
    return conn
  }

  return {
    init,
    find,
    findOne,
    insertOne,
    updateOne,
    demographicMeta,
    getClient,
  }
}
