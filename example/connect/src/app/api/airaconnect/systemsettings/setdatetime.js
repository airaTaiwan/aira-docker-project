const fs = require('node:fs')
const exec = require('node:child_process').exec

function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (stderr)
      callback(stderr)
    else callback(stdout)
  })
}

module.exports = async (data) => {
  global.spiderman.systemlog.writeInfo('systemsettings setdatetime')

  const self = this

  self.timezone_path = '/etc/timezone'
  self.ntpserver_path = '/etc/systemd/timesyncd.conf'

  // data.time_zone
  if (data.time_zone) {
    await new Promise((resolve, reject) => {
      const cmd = `timedatectl set-timezone ${data.time_zone}`
      execute(cmd, (callback) => {
        resolve(null)
      })
    })
  }

  // data.enable_auto_time
  if (data.enable_auto_time != undefined) {
    await new Promise((resolve, reject) => {
      const cmd = `timedatectl set-ntp ${data.enable_auto_time ? 'yes' : 'no'}`
      execute(cmd, (callback) => {
        resolve(null)
      })
    })
  }

  // data.ntp_server
  if (data.ntp_server != undefined) {
    await new Promise((resolve, reject) => {
      const wlines = []
      if (fs.existsSync(self.ntpserver_path)) {
        const rlines = fs
          .readFileSync(self.ntpserver_path, { encoding: 'utf-8' })
          .split('\n')
        for (let i = 0; i < rlines.length; i++) {
          const tmp = rlines[i].trim()

          if (tmp[0] != '#') {
            const tmp1 = (`${rlines[i].trim()}=`).split('=')

            if (tmp1[0].trim() == 'NTP')
              wlines.push(`NTP=${data.ntp_server}`)
          }
          else {
            wlines.push(rlines[i])
          }
        }

        fs.writeFileSync(self.ntpserver_path, wlines.join('\n'), 'UTF-8')
        resolve(null)
      }
    })
  }

  // data.timestamp
  if (data.timestamp) {
    const ts = `${data.timestamp}`
    if (ts.trim() != '') {
      await new Promise((resolve, reject) => {
        const cmd = `timedatectl set-time '${data.timestamp}'`
        execute(cmd, (callback) => {
          resolve(null)
        })
      })
    }
  }

  const ret = {
    message: 'ok',
  }

  global.spiderman.systemlog.writeInfo(
    `systemsettings setdatetime ${JSON.stringify(ret)}`,
  )

  return ret
}
