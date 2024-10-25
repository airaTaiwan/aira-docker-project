module.exports = () => {
  const size = (object) => {
    let bytes = 0

    function calculateSize(obj) {
      if (obj !== null && obj !== undefined) {
        switch (typeof obj) {
          case 'number':
            bytes += 8
            break
          case 'string':
            bytes += obj.length * 2
            break
          case 'boolean':
            bytes += 4
            break
          case 'object': {
            const objClass = Object.prototype.toString.call(obj).slice(8, -1)
            if (objClass === 'Object' || objClass === 'Array') {
              Object.keys(obj).forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(obj, key))
                  return
                calculateSize(obj[key])
              })
            }
            else {
              bytes += obj.toString().length * 2
            }
            break
          }

          default:
            break
        }
      }
      return bytes
    }

    return calculateSize(object)
  }

  return {
    size,
  }
}
