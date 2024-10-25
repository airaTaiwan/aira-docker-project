const fs = require('node:fs')

module.exports = ({ workingFolder, name }) => {
  const FOLIDER_PATH = `${workingFolder}/${name}`
  if (!fs.existsSync(FOLIDER_PATH)) {
    fs.mkdirSync(FOLIDER_PATH)
  }

  function findOne(path) {
    const FILE_PATH = `${FOLIDER_PATH}/${path}`
    try {
      const image = fs.readFileSync(FILE_PATH).toString('utf8')
      return image
    }
    catch {
      return ''
    }
  }

  function insertOne(path, image) {
    const FILE_PATH = `${FOLIDER_PATH}/${path}`

    fs.writeFileSync(FILE_PATH, image)
  }

  function deleteOne(path) {
    const FILE_PATH = `${FOLIDER_PATH}/${path}`

    fs.unlinkSync(FILE_PATH)
  }

  async function deleteMany(paths) {
    await Promise.allSettled(paths.map(path => deleteOne(path)))
  }

  return {
    findOne,
    insertOne,
    deleteOne,
    deleteMany,
  }
}
