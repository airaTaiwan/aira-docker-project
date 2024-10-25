const { uuid } = require('uuidv4')

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
  {
    fieldName: 'permission',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'remarks',
    fieldType: 'string',
    required: true,
  },
]

module.exports = (data, tokenUser) => {
  global.spiderman.systemlog.writeInfo(`account create ${JSON.stringify(data)}`)

  // paramters checker
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  const isPassed
    = tokenUser.u.length > 0
    && data.username.length > 0
    && data.password.length > 0
    && data.permission.length > 0
  if (!isPassed) {
    global.spiderman.systemlog.writeError(
      'Username or password cannot be empty.',
    )
    throw new Error('Username or password cannot be empty.')
  }

  const accounts = global.spiderman.db.account.find()

  const adminAccount = accounts.find(
    item => item.username === tokenUser.u && item.permission === 'Admin',
  )
  if (!adminAccount) {
    global.spiderman.systemlog.writeError('No permission.')
    throw new Error('No permission.')
  }

  const existededAccount = accounts.find(
    item => item.username === data.username,
  )
  if (existededAccount) {
    global.spiderman.systemlog.writeError('The item has already existed.')
    throw new Error('The item has already existed.')
  }

  // optional paramters set default value

  //  ===================================
  const { username, password, permission, remarks } = data

  const account = {
    uuid: uuid(),
    username,
    password,
    permission,
    remarks: remarks || '',
    fixed: false,
    create_date: Date.now(),
    last_modify_date: Date.now(),
  }

  global.spiderman.db.account.insertOne(account)

  global.spiderman.systemlog.writeInfo(
    `account create ${account.uuid} ${account.username}`,
  )

  return {
    message: 'ok',
  }
}
