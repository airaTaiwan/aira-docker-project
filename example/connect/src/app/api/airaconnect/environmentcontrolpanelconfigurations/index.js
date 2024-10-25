const Joi = require('joi')

const schema = Joi.object({
  start_time: Joi.number().integer().min(0).default(0),
  end_time: Joi.number().integer().default(0),
  take: Joi.number().integer().min(1).default(20),
  skip: Joi.number().integer().default(0),
})

function getDb() {
  const mongoClient = global.domain.workerMongo.getClient()
  const db = mongoClient.db(global.params.mongodb.db)
  return db
}

module.exports = async (incoming, user) => {
  const payload = await schema.validateAsync(incoming)
  const $and = []
  if (payload.start_time)
    $and.push({ createdAt: { $gte: payload.start_time } })
  if (payload.end_time)
    $and.push({ createdAt: { $lt: payload.end_time } })
  const filters = $and.length ? { $and } : {}
  const query = getDb()
    .collection(`CMSEnvironmentControlPanelConfiguration`)
    .find(filters)
  const total = await query.count()
  const more = total > payload.skip + payload.take
  const cursor = query.skip(payload.skip).take(payload.take)
  const records = []
  for await (const { _id: uuid, ...record } of cursor)
    records.push({ uuid, ...record })
  return {
    total,
    more,
    records,
  }
}
