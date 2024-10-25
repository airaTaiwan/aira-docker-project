module.exports = () => {
  global.spiderman.systemlog.writeInfo('systemsettings get')

  const settings = global.spiderman.db.serverprofile.find()

  delete settings.session

  const ret = {
    message: 'ok',
    settings,
  }

  global.spiderman.systemlog.writeInfo(
    `systemsettings find ${JSON.stringify(ret)}`,
  )

  return ret
}
