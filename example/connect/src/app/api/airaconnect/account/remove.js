const fieldChecks = [
  {
    fieldName: 'account_uuid_list',
    fieldType: 'array',
    required: true,
  },
]

module.exports = (data, tokenUser) => {
  global.spiderman.systemlog.writeInfo(`account remove ${JSON.stringify(data)}`)

  // paramters checker
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  })

  if (!tokenUser.u || data.account_uuid_list.length === 0) {
    throw new Error('list cannot be empty')
  }

  const accounts = global.spiderman.db.account.find()

  // 檢查是否為使用Admin權限
  const isAdmin = accounts.some(
    a => a.username === tokenUser.u && a.permission === 'Admin',
  )
  if (!isAdmin) {
    global.spiderman.systemlog.writeError('No permission.')
    throw new Error('No permission.')
  }

  const newAccountList = accounts.filter((item) => {
    const isDeleting = data.account_uuid_list.includes(item.uuid)
    return !isDeleting || item.fixed
  })

  if (newAccountList.length === accounts.length) {
    global.spiderman.systemlog.writeError('Item not found.')
    throw new Error('Item not found.')
  }

  global.spiderman.db.account.set(newAccountList)

  global.spiderman.systemlog.writeInfo(`account remove ${newAccountList}`)

  return {
    message: 'ok',
  }
}
