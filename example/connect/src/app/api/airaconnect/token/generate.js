const fieldChecks = [
  {
    fieldName: 'username',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'password',
    fieldType: 'string',
    required: true,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`token generate ${JSON.stringify(data)}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const { username, password } = data
  const account = global.spiderman.db.account.findOne({ username, password })

  if (!account) {
    global.spiderman.systemlog.writeError('Unauthorized')
    throw new Error('Unauthorized')
  }

  const ret = {
    message: 'ok',
    username: account.username,
    permission: account.permission,
    expire: Date.now(),
    token: await global.spiderman.token.encryptFromAccount({
      u: account.username,
      p: account.password,
      t: Date.now(),
      x: account.permission,
    }),
  }

  global.spiderman.systemlog.writeInfo(`token generate ${JSON.stringify(ret)}`)

  return ret
}
