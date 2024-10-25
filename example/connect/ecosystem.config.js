const { version, name } = require('./package.json')

const app = {
  name,
  script: './src/main.js',
  ignore_watch: ['data', 'src/data'],
}
module.exports = { apps: [app] }
