const { uuid: uuidv4 } = require('uuidv4')

module.exports = () => {
  async function find({ start_time, end_time, sliceShift, sliceLength }) {
    global.spiderman.systemlog.writeInfo(
      `domain operationcase find ${start_time}, ${end_time}, ${sliceShift}, ${sliceLength}`,
    )

    const { totalLength, result } = await global.domain.crud.find({
      collection: 'operationcase',
      query: {
        time: { $gte: start_time, $lte: end_time },
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
      `domain operationcase create ${JSON.stringify(data)}`,
    )

    data.uuid = uuidv4()
    global.domain.crud.insertOne({
      collection: 'operationcase',
      data,
      uniqueKeys: ['uuid'],
    })
  }
  return {
    find,
    create,
  }
}
