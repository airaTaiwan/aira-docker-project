const fieldChecks = [
  {
    fieldName: 'token',
    fieldType: 'string',
    required: false,
  },
]

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo(`token maintain ${JSON.stringify(data)}`)

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const validAccountData = await global.spiderman.token.decryptToAccountInTime(
    data.token,
  )
  if (!validAccountData) {
    global.spiderman.systemlog.writeError('The token has expired.')
    throw new Error('The token has expired.')
  }

  const { u: username, p: password } = validAccountData
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
    token: global.spiderman.token.encryptFromAccount({
      u: account.username,
      p: account.password,
      t: Date.now(),
      x: account.permission,
    }),
  }

  global.spiderman.systemlog.writeInfo(`token maintain ${JSON.stringify(ret)}`)

  return ret
}
