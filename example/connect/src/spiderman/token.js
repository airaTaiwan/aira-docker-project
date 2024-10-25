const TOKEN_KEY = 'aira83522758'
const EXPIRY = 3600000
const cacheExpiry = 86400 * 15
module.exports = () => {
  async function encryptFromAccount(account) {
    const string = JSON.stringify(account)
    const textToChars = tmp => tmp.split('').map(c => c.charCodeAt(0))
    const byteHex = n => `0${Number(n).toString(16)}`.substr(-2)

    const applySaltToChar = code =>
      textToChars(TOKEN_KEY).reduce((a, b) => a ^ b, code)
    const token = string
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('')
    // await global.spiderman.redis.set(token, string, 'EX', cacheExpiry)
    return token
  }

  async function decryptToAccount(encoded) {
    // const hit = await global.spiderman.redis.get(encoded)
    // if (hit) return JSON.parse(hit)
    const textToChars = text => text.split('').map(c => c.charCodeAt(0))

    const applySaltToChar = code =>
      textToChars(TOKEN_KEY).reduce((a, b) => a ^ b, code)

    const string = encoded
      .match(/.{1,2}/g)
      .map(hex => Number.parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('')
    // await global.spiderman.redis.set(encoded, string, 'EX', cacheExpiry)
    const account = JSON.parse(string)
    return account
  }

  async function decryptToAccountInTime(token) {
    const accountData = await decryptToAccount(token)
    const isExpired = Date.now() > accountData.t + EXPIRY
    if (isExpired)
      return null
    return accountData
  }

  return {
    encryptFromAccount,
    decryptToAccount,
    decryptToAccountInTime,
  }
}
