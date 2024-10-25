module.exports = () => {
  function writeInfo(logString) {
    write({ logType: 'info', logString })
  }

  function writeWarning(logString) {
    write({ logType: 'warning', logString })
  }

  function writeError(logString) {
    write({ logType: 'error', logString })
  }

  return {
    writeInfo,
    writeWarning,
    writeError,
  }
}

function write({ logType, logString }) {
  logString = logString.substring(0, 250)

  console.log(`log ${logType}: ${logString}`)

  // return global.spiderman.request.make({
  //   url: `http://${global.params.localhost}/system/writelog`,
  //   method: 'POST',
  //   pool: { maxSockets: 10 },
  //   time: true,
  //   timeout: 3000,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   json: {
  //     log_type: logType,
  //     log_string: logString,
  //   },
  // });
}
