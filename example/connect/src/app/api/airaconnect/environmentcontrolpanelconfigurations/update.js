const Joi = require('joi')

const schema = Joi.object({
  uuid: Joi.string(),
  name: Joi.string().max(15).required(),
  areaId: Joi.array().items(Joi.string()).required(),
  backgroundImg: Joi.string().allow(''),
  logoImg: Joi.string().allow(''),
  enableCssFilter: Joi.boolean().required(),
  content: Joi.object({
    title: Joi.string().max(15).allow(''),
    subTitle: Joi.string().max(20).allow(''),
    companyName: Joi.string().max(15).allow(''),
  }),
  carouselDelay: Joi.number().integer().min(0).required(),
  groups: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().max(15).allow(''),
        list: Joi.array().items(Joi.string()).required(),
        flow: Joi.number().integer(),
      }),
    )
    .min(2),
  createdAt: Joi.any(),
  updatedAt: Joi.any(),
})

function getDb() {
  const mongoClient = global.domain.workerMongo.getClient()
  const db = mongoClient.db(global.params.mongodb.db)
  return db
}

module.exports = async (incoming, user) => {
  const {
    uuid: _id,
    createdAt,
    updatedAt,
    ...payload
  } = await schema.validateAsync(incoming)
  const now = Date.now()
  try {
    await getDb()
      .collection(`CMSEnvironmentControlPanelConfiguration`)
      .updateOne({ _id }, { $set: { ...payload, updatedAt: now } })
    return { message: 'ok' }
  }
  catch (error) {
    return { message: error.message }
  }
}
