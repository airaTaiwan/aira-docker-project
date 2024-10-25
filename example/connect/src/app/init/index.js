module.exports = () => {
  global.domain.workerMongo.init()
  global.domain.workerMsgServer.init()
}
