const fs = require('node:fs')

const DATA_FOLDER = `${global.params.dataPath}`
const DB_FOLDER = `${global.params.dataPath}/db`

if (!fs.existsSync(DATA_FOLDER)) {
  fs.mkdirSync(DATA_FOLDER)
}
if (!fs.existsSync(DB_FOLDER)) {
  fs.mkdirSync(DB_FOLDER)
}

module.exports = {
  db: {
    collections: [
      {
        name: 'serverprofile',
        type: 'file',
        cache: { isOpen: true },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'account',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicetype',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicegroup',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicesenv',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicesmac',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicesair',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicesele',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicesgate',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'devicescomm',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'map',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      // {
      //   name: 'dashboardsettings',
      //   type: 'file',
      //   cache: { isOpen: true },
      //   workingFolder: DB_FOLDER,
      // },
      {
        name: 'serversettings',
        type: 'file',
        cache: { isOpen: true },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'systemlog',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
        workingFolder: DATA_FOLDER,
      },
      {
        name: 'operationcase',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
      {
        name: 'eventhandle',
        type: 'file',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
        workingFolder: DB_FOLDER,
      },
    ],
  },
}
