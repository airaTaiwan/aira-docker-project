module.exports = (data) => {
  global.spiderman.systemlog.writeInfo(
    `systemsettings set ${JSON.stringify(data)}`,
  )

  const settings = global.spiderman.db.serverprofile.find()

  data = { ...settings, ...data }

  data.last_modify_date = Date.now()

  global.spiderman.db.serverprofile.updateOne({}, data)

  return {
    message: 'ok',
  }
}
