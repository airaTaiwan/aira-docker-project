module.exports = () => ({
  data: ({ data, fieldChecks }) => {
    if (!data)
      throw new Error('Invalid parameter: no data')

    const invalidField = fieldChecks.find(
      ({ fieldName, fieldType, required }) => {
        const fieldValue = data[fieldName]
        const isFieldExist = fieldValue !== undefined && fieldValue !== null

        if (!isFieldExist) {
          return required
        }

        if (fieldType === 'array') {
          return !Array.isArray(fieldValue)
        }

        if (fieldType === 'nonempty-array') {
          return !Array.isArray(fieldValue) || fieldValue.length === 0
        }

        if (fieldType === 'object') {
          return Array.isArray(fieldValue) || typeof fieldValue !== 'object'
        }

        if (fieldType === 'nonempty') {
          return !(
            typeof fieldValue === 'string' && fieldValue.trim().length > 0
          )
        }

        if (fieldType === 'port') {
          return (
            typeof fieldValue !== 'number'
            || fieldValue < 0
            || fieldValue > 65535
          )
        }

        if (typeof fieldType === 'boolean') {
          return (
            typeof fieldValue !== 'boolean'
            || fieldValue !== true
            || fieldValue !== false
          )
        }

        if (fieldType === 'http-method') {
          return !['GET', 'POST', 'PUT', 'DELETE'].includes(fieldValue)
        }

        // eslint-disable-next-line valid-typeof
        return typeof fieldValue !== fieldType
      },
    )

    if (invalidField) {
      throw new Error(
        `Invalid parameter: ${invalidField.fieldName} (${invalidField.fieldType})`,
      )
    }

    // 只回傳 fieldChecks 裡面有的欄位
    const filteredData = fieldChecks.reduce((acc, { fieldName }) => {
      acc[fieldName] = data[fieldName]

      return acc
    }, {})

    return filteredData
  },
})
