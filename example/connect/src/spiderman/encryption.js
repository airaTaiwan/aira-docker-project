const bcrypt = require('bcryptjs')

module.exports = () => {
  const sessionKey = 't/6a54idkrru4aej31zp4u.3vu04ej/n'

  function genSaltSync() {
    const salt = bcrypt.genSalt(10, (err, salt) => {})
    return salt
  }

  // function genSessionId() {
  //     return bcrypt.hashSync(sessionKey, genSaltSync());
  // }

  function encryptPassword(password) {
    return bcrypt.hashSync(password, genSaltSync())
  }

  async function comparePassword(password, hashpassword) {
    return await bcrypt.compare(password, hashpassword)
  }

  return {
    encryptPassword,
    comparePassword,
  }
}
