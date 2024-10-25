// 指定要列出檔案的資料夾路徑
module.exports = () => {
  const items = [
    'serverprofile.js',
    'account.js',
    'devicetype.js',
    'devicegroup.js',
    'devicesenv.js',
    'devicesmac.js',
    'devicesair.js',
    'devicesele.js',
    'devicesgate.js',
    'devicescomm.js',
    'eventhandle.js',
    'map.js',
    'operationcase.js',
    // 'systemlog.js',
  ]

  const defaultData = (() => {
    const tmp = {}

    items.forEach((item) => {
      const name = item.split('.')[0]
      tmp[name] = require(`./${item}`)
    })

    return tmp
  })()

  return defaultData
}
