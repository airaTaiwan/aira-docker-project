const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(isBetween)

module.exports = () => dayjs
