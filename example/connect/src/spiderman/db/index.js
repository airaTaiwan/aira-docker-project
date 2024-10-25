const useFile = require('./useFile')
const useImage = require('./useImage')
const useRecord = require('./useRecord')

module.exports = ({ collections }) => {
  const db = {}
  collections.forEach(({ workingFolder, name, type = 'file', cache = {} }) => {
    const dbInstance = (() => {
      let instance
      switch (type) {
        case 'file':
          instance = useFile({
            workingFolder,
            name,
            cache,
          })
          break

        case 'record':
          instance = useRecord({
            workingFolder,
            name,
            cache,
          })
          break

        case 'image':
          instance = useImage({
            workingFolder,
            name,
          })
          break

        default:
          instance = {}
          console.log(`Sorry, we are out of ${type}.`)
      }

      return instance
    })()

    const dbInstanceProxy = new Proxy(dbInstance, {
      get(target, prop) {
        if (!(prop in target)) {
          throw new Error(`System: Function ${prop} does not exist in ${name}.`)
        }
        return target[prop]
      },
    })

    db[name] = dbInstanceProxy
  })

  const dbProxy = new Proxy(db, {
    get(target, prop) {
      if (!(prop in target)) {
        throw new Error(`System: Collection ${prop} does not exist.`)
      }
      return target[prop]
    },
  })

  return dbProxy
}
