const Joi = require('joi')

const schema = Joi.object({
  uuid: Joi.array().items(Joi.string()).required(),
})

function getDb() {
  const mongoClient = global.domain.workerMongo.getClient()
  const db = mongoClient.db(global.params.mongodb.db)
  return db
}

module.exports = async (incoming, user) => {
  const { uuid } = await schema.validateAsync(incoming)
  try {
    await getDb()
      .collection(`CMSEnvironmentControlPanelConfiguration`)
      .deleteMany({ _id: { $in: uuid } })
    return { message: 'ok' }
  }
  catch (error) {
    return { message: error.message }
  }
}
