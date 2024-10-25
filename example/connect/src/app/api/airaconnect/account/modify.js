const fieldChecks = [
  {
    fieldName: 'username',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'new_password',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'new_permission',
    fieldType: 'string',
    required: false,
  },
]

module.exports = (data, tokenUser) => {
  global.spiderman.systemlog.writeInfo(`account modify ${JSON.stringify(data)}`)

  // paramters checker
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  // 檢查使用者名稱和新密碼是否為空
  if (!tokenUser.u || !data.username || !data.new_password) {
    global.spiderman.systemlog.writeError(
      'Username or password cannot be empty.',
    )
    throw new Error('Username or password cannot be empty.')
  }

  // 檢查權限
  if (data.username === 'Admin' && tokenUser.u !== 'Admin') {
    global.spiderman.systemlog.writeError('No permission.')
    throw new Error('No permission.')
  }

  const accounts = global.spiderman.db.account.find()

  // 檢查是否為使用Admin權限
  const isAdmin = accounts.some(
    a => a.username === tokenUser.u && a.permission === 'Admin',
  )

  // 尋找要修改的帳號
  const account = accounts.find(a => a.username === data.username)
  if (!account) {
    global.spiderman.systemlog.writeError('Item not found.')
    throw new Error('Item not found.')
  }

  // 檢查是否有修改帳號的權限
  const canModifyAccount = isAdmin || tokenUser.u === account.username
  if (!canModifyAccount) {
    global.spiderman.systemlog.writeError('No permission.')
    throw new Error('No permission.')
  }

  // 更新帳號資料
  const set = {
    last_modify_date: Date.now(),
    password: data.new_password,
    ...(data.new_permission ? { permission: data.new_permission } : {}),
  }

  global.spiderman.db.account.updateOne({ username: account.username }, set)

  global.spiderman.systemlog.writeInfo(
    `account modify ${account.uuid} ${account.username}`,
  )

  return {
    message: 'ok',
  }
}
