const Joi = require('joi')

const schema = Joi.object({
  notificationIds: Joi.array().items(Joi.string()).required().min(1),
})

/**
 * @typedef {object} User
 * @property u: string
 * @property p: string
 * @property t: number
 * @property x: string
 */

function getDb() {
  const mongoClient = global.domain.workerMongo.getClient()
  const db = mongoClient.db(global.params.mongodb.db)
  return db
}

module.exports = async (incoming, user) => {
  const { notificationIds } = await schema.validateAsync(incoming)
  await getDb()
    .collection(`EventDispatcherAlert`)
    .updateMany(
      { _id: { $in: notificationIds } },
      {
        $set: { [`read.${user.u}`]: Date.now() },
      },
    )
  return {
    message: 'ok',
  }
}
