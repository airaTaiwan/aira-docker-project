const request = require('request')
// const fs = require("fs");

module.exports = () => {
  async function getBearerToken(serverAddress, serverPort, username, password) {
    const startTime = Date.now()

    const ret = await new Promise((resolve) => {
      const data = {
        username,
        password,
        setCookie: true,
      }

      request.post(
        `https://${serverAddress}:${serverPort}/rest/v1/login/sessions`,
        { json: data },
        (err, response, body) => {
          if (!err && response.statusCode == 200) {
            // {
            //     ageS: 1,
            //     expiresInS: 2591999,
            //     token: 'vms-b8d35182613056100cd8ef5a3f1cd7ab-e8oIlhHIOx',
            //     username: 'admin'
            // }
            resolve(Object.assign({}, body))
          }

          resolve(Object.assign({}, err))
        },
      )
    })

    let bearerToken = ''
    if (ret.token) {
      bearerToken = ret.token
    }

    console.log('getBearerToken 1', Date.now() - startTime)

    return bearerToken
  }

  async function getBasicToken(serverAddress, serverPort, username, password) {
    const startTime = Date.now()

    const buff = Buffer.from(`${username}:${password}`, 'utf-8')
    const bearerToken = buff.toString('base64')

    return bearerToken
  }

  async function getCamerasEx(
    serverAddress,
    serverPort,
    username,
    password,
    authorization = 'basic',
  ) {
    const startTime = Date.now()

    let token = ''
    if (authorization == 'bearer') {
      token = await getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await getBasicToken(serverAddress, serverPort, username, password)
    }

    return new Promise((resolve) => {
      try {
        const data = null
        const options = {
          url: `https://${username}:${password}@${serverAddress}:${serverPort}/ec2/getCamerasEx`,
          timeout: 5000,
          headers: {
            'content-type': 'text/json',
            // "authorization":
            //     authorization == "bearer"
            //         ? "bearer " + bearerToken
            //         : "basic " + bearerToken
          },
        }
        if (authorization == 'bearer') {
          options.headers.authorization = `bearer ${token}`
        }
        const req = request.get(options, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            const camListToReturn = []
            const resData = JSON.parse(body)
            /*
            {
                addParams: [
                ...
                ],
                audioEnabled: false,
                backupType: "CameraBackupDefault",
                controlEnabled: true,
                dewarpingParams: "{"enabled":false,"fovRot":0,"hStretch":1,"radius":0.5,"viewMode":"1","xCenter":0.5,"yCenter":0.5}",
                disableDualStreaming: false,
                failoverPriority: "Medium",
                groupId: "",
                groupName: "",
                id: "{78ec0093-8d6f-6a0b-46d2-75aafee8dda1}",
                licenseUsed: false,
                logicalId: "",
                mac: "AC-CC-8E-E6-BE-70",
                manuallyAdded: false,
                maxArchiveDays: -30,
                minArchiveDays: -1,
                model: "AXISP3245LVE",
                motionMask: "5,0,0,44,32",
                motionType: "2",
                name: "AXISP3245LVE",
                parentId: "{8543bad3-d679-878e-8453-caf2f56364d2}",
                physicalId: "AC-CC-8E-E6-BE-70",
                preferredServerId: "{8543bad3-d679-878e-8453-caf2f56364d2}",
                recordAfterMotionSec: 5,
                recordBeforeMotionSec: 5,
                scheduleEnabled: false,.
                scheduleTasks: [],
                status: "Offline",
                statusFlags: "CSF_NoFlags",
                typeId: "{88bd6cc2-b99b-07e0-a4e4-108faa7ad797}",
                url: "http://192.168.10.198:80",
                userDefinedGroupName: "",
                vendor: "Axis"
            },
            */

            resData.forEach((cameraData) => {
              camListToReturn.push({
                server: {
                  ip: serverAddress,
                  port: serverPort,
                  user: username,
                  pass: password,
                },
                name: cameraData.name,
                camera_id: cameraData.id.replace(/(\{)|(\})/g, ''),
                parent_id: cameraData.parentId.replace(/(\{)|(\})/g, ''),
                preferred_server_id: cameraData.preferredServerId.replace(
                  /(\{)|(\})/g,
                  '',
                ),
                mac: cameraData.mac,
                schedule_enabled: cameraData.scheduleEnabled,
                vendor: cameraData.vendor,
                status: cameraData.status, // Online, Offline, Unauthorized, Recording
              })
            })
            const returnData = { error: null, data: camListToReturn }
            resolve(Object.assign({}, returnData))
          }
          else {
            resolve(Object.assign({}, { error: err }))
          }
        })
      }
      catch (e) {
        resolve(Object.assign({}, { error: e }))
      }
    })
  }

  async function getSysteminfo(
    serverAddress,
    serverPort,
    username,
    password,
    authorization = 'basic',
  ) {
    const startTime = Date.now()

    let token = ''
    if (authorization == 'bearer') {
      token = await getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await getBasicToken(serverAddress, serverPort, username, password)
    }

    return new Promise((resolve) => {
      try {
        const options = {
          url: `https://${username}:${password}@${serverAddress}:${serverPort}/rest/v2/system/info`,
          timeout: 5000,
          headers: {
            'content-type': 'text/json',
            // "authorization":
            //     authorization == "bearer"
            //         ? "bearer " + bearerToken
            //         : "basic " + bearerToken
          },
        }
        if (authorization == 'bearer') {
          options.headers.authorization = `bearer ${token}`
        }

        const req = request.get(options, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            const resData = JSON.parse(body)
            // {
            //     "cloudHost": "nxvms.com",
            //     "cloudId": "5b1c8b47-ca58-41d9-bdf0-62661d74b6ce",
            //     "cloudOwnerId": "{dcd1db15-d51a-6b94-3b92-eb590c473375}",
            //     "customization": "default",
            //     "devices": [
            //         "{42f4cfff-1971-3980-128c-0610790099ae}",
            //         "{2bab590d-cad1-d05f-d2fe-2110bfc1ade3}"
            //     ],
            //     "localId": "{7bdd0d41-cdb1-4624-b608-2c9bc8bdcde4}",
            //     "name": "aira-Track-AIRAOFF",
            //     "protoVersion": 5107,
            //     "servers": [
            //         "{8ea4b96c-9c45-577e-12ff-29ce52ec226d}"
            //     ],
            //     "synchronizedTimeMs": 1706670099538,
            //     "version": "5.1.1.37512"
            // }
            const returnData = { error: null, data: resData }
            resolve(Object.assign({}, returnData))
          }
          else {
            resolve(
              Object.assign(
                {},
                { error: null, data: { version: '4.2.0.32840' } },
              ),
            )
          }
        })
      }
      catch (e) {
        resolve(
          Object.assign({}, { error: null, data: { version: '4.2.0.32840' } }),
        )
      }
    })
  }

  async function getMediaServersEx(
    serverAddress,
    serverPort,
    username,
    password,
    authorization = 'basic',
  ) {
    const startTime = Date.now()

    let token = ''

    if (authorization == 'bearer') {
      token = await getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await getBasicToken(serverAddress, serverPort, username, password)
    }

    return new Promise((resolve) => {
      try {
        const options = {
          url: `https://${username}:${password}@${serverAddress}:${serverPort}/ec2/getMediaServersEx`,
          timeout: 5000,
          headers: {
            'content-type': 'text/json',
            // "authorization":
            //     authorization == "bearer"
            //         ? "bearer " + bearerToken
            //         : "basic " + bearerToken
          },
        }

        if (authorization == 'bearer') {
          options.headers.authorization = `bearer ${token}`
        }

        const req = request.get(options, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            const svrListToReturn = []
            const resData = JSON.parse(body)
            /*
                {
                    "addParams": [ ... ],
                    "allowAutoRedundancy": false,
                    "authKey": "{d310fc93-04fe-4dff-a7e6-1f237bca2519}",
                    "backupBitrate": -12500000,
                    "backupDaysOfTheWeek": "254",
                    "backupDuration": -1,
                    "backupStart": 0,
                    "backupType": "BackupManual",
                    "flags": "SF_HasPublicIP|SF_Has_HDD|SF_SupportsTranscoding",
                    "id": "{cbdfbe17-5cb4-38f9-dd1f-ad6375adc03f}",
                    "maxCameras": 0,
                    "metadataStorageId": "{00000000-0000-0000-0000-000000000000}",
                    "name": "Server FTS",
                    "networkAddresses": "192.168.10.199:7001;61.216.4.207:7001",
                    "osInfo": "{"platform":"windows_x64","variant":"","variantVersion":"10.0.18362"}",
                    "parentId": "{00000000-0000-0000-0000-000000000000}",
                    "status": "Online",
                    "storages": [...],
                    "systemInfo": "",
                    "typeId": "{be5d1ee0-b92c-3b34-86d9-bca2dab7826f}",
                    "url": "https://192.168.10.199:7001",
                    "version": "4.1.0.31398"
                }
            */

            resData.forEach((serverData) => {
              svrListToReturn.push({
                server: {
                  ip: serverAddress,
                  port: serverPort,
                  user: username,
                  pass: password,
                },
                name: serverData.name,
                id: serverData.id.replace(/(\{)|(\})/g, ''),
                parent_id: serverData.parentId.replace(/(\{)|(\})/g, ''),
                networkAddresses: serverData.networkAddresses,
                status: serverData.status, // Online, Offline, Unauthorized, Recording
                version: serverData.version,
              })
            })
            const returnData = { error: null, data: svrListToReturn }
            resolve(Object.assign({}, returnData))
          }
          else {
            resolve(Object.assign({}, { error: err }))
          }
        })
      }
      catch (e) {
        resolve(Object.assign({}, { error: e }))
      }
    })
  }

  async function getAddBookmarkEx(
    serverAddress,
    serverPort,
    username,
    password,
    authorization,
    params,
  ) {
    let token = ''
    if (authorization == 'bearer') {
      token = await getBearerToken(
        serverAddress,
        serverPort,
        username,
        password,
      )
    }
    else {
      token = await getBasicToken(serverAddress, serverPort, username, password)
    }

    const cameraId = params.cameraId
    const timestamp = params.timestamp
    const caption = params.caption
    const description = params.description

    return new Promise((resolve) => {
      try {
        // console.log( `https://${serverAddress}:${serverPort}/api/createEvent` );
        // metadata={"cameraRefs":["66144792-4c3f-a282-7c35-af49296ba66a"]}&
        // timestamp=[<DATETIME>]&
        // caption=[<FULLNAME>]&
        // description=XXXXXXX
        let qs = `metadata={"cameraRefs":["${cameraId}"]}&timestamp=${timestamp}&caption=${caption}`

        if (description)
          qs += `&description=${description}`

        console.log(
          `https://${username}:${password}@${serverAddress}:${serverPort}/api/createEvent?${
            qs}`,
        )

        const data = null
        const options = {
          url:
            `https://${username}:${password}@${serverAddress}:${serverPort}/api/createEvent?${
              qs}`,
          timeout: 5000,
          headers: {
            'content-type': 'text/json',
            // "authorization":
            //     authorization == "bearer"
            //         ? "bearer " + bearerToken
            //         : "basic " + bearerToken
          },
        }

        if (authorization == 'bearer') {
          options.headers.authorization = `bearer ${token}`
        }

        const req = request.get(options, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            const resData = JSON.parse(body)
            const returnData = { error: null }
            resolve(Object.assign({}, returnData))
          }
          else {
            resolve(Object.assign({}, { error: err }))
          }
        })
      }
      catch (e) {
        resolve(Object.assign({}, { error: e }))
      }
    })
  }

  return {
    getBasicToken,
    getBearerToken,
    getSysteminfo, //
    getCamerasEx, //
    getMediaServersEx, //
    getAddBookmarkEx, //
  }
}
