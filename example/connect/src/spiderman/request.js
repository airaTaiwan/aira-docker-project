const request = require('request')

module.exports = () => {
  function make({
    url,
    method = 'POST',
    headers = { 'Content-Type': 'application/json' },
    ...others
  }) {
    return new Promise((resolve, reject) => {
      request(
        {
          url,
          method,
          headers,
          ...others,
        },
        (error, response, body) => {
          if (error) {
            global.spiderman.systemlog.writeError(
              `senf http error ${url} ${error}`,
            )
          }

          // console.log('error', url, error);
          // console.log('body', url, body);

          if (error) {
            reject(error)
          }
          else {
            resolve(body)
          }
        },
      )
    })
  }

  return { make }
}
