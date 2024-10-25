module.exports = () => {
  const publicCgi = ['generatetoken', 'maintaintoken', 'resetpassword']
  const router = {
    // V
    generatetoken: require('../../app/api/airaconnect/token/generate'),
    maintaintoken: require('../../app/api/airaconnect/token/maintain'),

    // V
    createaccount: require('../../app/api/airaconnect/account/create'),
    findaccount: require('../../app/api/airaconnect/account/find'),
    modifyaccount: require('../../app/api/airaconnect/account/modify'),
    removeaccount: require('../../app/api/airaconnect/account/remove'),
    resetpassword: require('../../app/api/airaconnect/account/resetpassword'),

    // // V
    // createperson: require('../../app/api/airafacelite/person/create'),
    // findperson: require('../../app/api/airafacelite/person/find'),
    // modifyperson: require('../../app/api/airafacelite/person/modify'),
    // removeperson: require('../../app/api/airafacelite/person/remove'),
    // removeallpersons: require('../../app/api/airafacelite/person/removeall'),
    // fetchphoto: require('../../app/api/airafacelite/person/fetchphoto'),

    // // V
    // createvisitor: require('../../app/api/airafacelite/visitor/create'),
    // findvisitor: require('../../app/api/airafacelite/visitor/find'),
    // modifyvisitor: require('../../app/api/airafacelite/visitor/modify'),
    // removevisitor: require('../../app/api/airafacelite/visitor/remove'),
    // removeallvisitors: require('../../app/api/airafacelite/visitor/removeall'),

    // V
    createdevicetype: require('../../app/api/airaconnect/devicetype/create'),
    finddevicetype: require('../../app/api/airaconnect/devicetype/find'),
    modifydevicetype: require('../../app/api/airaconnect/devicetype/modify'),
    removedevicetype: require('../../app/api/airaconnect/devicetype/remove'),

    // V
    createdevicegroup: require('../../app/api/airaconnect/devicegroup/create'),
    finddevicegroup: require('../../app/api/airaconnect/devicegroup/find'),
    modifydevicegroup: require('../../app/api/airaconnect/devicegroup/modify'),
    removedevicegroup: require('../../app/api/airaconnect/devicegroup/remove'),

    // V
    createdevicesenv: require('../../app/api/airaconnect/devicesenv/create'),
    finddevicesenv: require('../../app/api/airaconnect/devicesenv/find'),
    modifydevicesenv: require('../../app/api/airaconnect/devicesenv/modify'),
    removedevicesenv: require('../../app/api/airaconnect/devicesenv/remove'),

    // V
    createdevicesmac: require('../../app/api/airaconnect/devicesmac/create'),
    finddevicesmac: require('../../app/api/airaconnect/devicesmac/find'),
    modifydevicesmac: require('../../app/api/airaconnect/devicesmac/modify'),
    removedevicesmac: require('../../app/api/airaconnect/devicesmac/remove'),

    // V
    createdevicesair: require('../../app/api/airaconnect/devicesair/create'),
    finddevicesair: require('../../app/api/airaconnect/devicesair/find'),
    modifydevicesair: require('../../app/api/airaconnect/devicesair/modify'),
    removedevicesair: require('../../app/api/airaconnect/devicesair/remove'),

    // V
    createdevicesele: require('../../app/api/airaconnect/devicesele/create'),
    finddevicesele: require('../../app/api/airaconnect/devicesele/find'),
    modifydevicesele: require('../../app/api/airaconnect/devicesele/modify'),
    removedevicesele: require('../../app/api/airaconnect/devicesele/remove'),

    // V
    systeminfo: require('../../app/api/airaconnect/vms_nx/systeminfo'),
    serverlist: require('../../app/api/airaconnect/vms_nx/serverlist'),
    cameralist: require('../../app/api/airaconnect/vms_nx/cameralist'),
    snapshoturl: require('../../app/api/airaconnect/vms_nx/snapshoturl'),
    addbookmarkex: require('../../app/api/airaconnect/vms_nx/addbookmarkex'),
    viewsnapshot: require('../../app/api/airaconnect/vms_nx/viewsnapshot'),
    viewmedia: require('../../app/api/airaconnect/vms_nx/viewmedia'),
    // downloadvideomedia: require('../../app/api/airaconnect/vms_nx/downloadvideomedia'),
    // motionmediaArchiveUrlList_webm: require('../../app/api/airaconnect/vms_nx/getMotionMediaArchiveUrlList_webm'),
    // motionmediaArchiveUrlList_mp4: require('../../app/api/airaconnect/vms_nx/getMotionMediaArchiveUrlList_mp4'),

    // V
    createdevicesgate: require('../../app/api/airaconnect/devicesgate/create'),
    finddevicesgate: require('../../app/api/airaconnect/devicesgate/find'),
    modifydevicesgate: require('../../app/api/airaconnect/devicesgate/modify'),
    removedevicesgate: require('../../app/api/airaconnect/devicesgate/remove'),

    // V
    createdevicescomm: require('../../app/api/airaconnect/devicescomm/create'),
    finddevicescomm: require('../../app/api/airaconnect/devicescomm/find'),
    modifydevicescomm: require('../../app/api/airaconnect/devicescomm/modify'),
    removedevicescomm: require('../../app/api/airaconnect/devicescomm/remove'),

    createmap: require('../../app/api/airaconnect/map/create'),
    findmap: require('../../app/api/airaconnect/map/find'),
    modifymap: require('../../app/api/airaconnect/map/modify'),
    removemap: require('../../app/api/airaconnect/map/remove'),

    findrowdata: require('../../app/api/airaconnect/report/findrowdata'),
    findmetadata: require('../../app/api/airaconnect/report/findmetadata'),

    createcase: require('../../app/api/airaconnect/operationcase/create'),
    findcase: require('../../app/api/airaconnect/operationcase/find'),

    // // V
    // createcamera: require('../../app/api/airafacelite/camera/create'),
    // findcamera: require('../../app/api/airafacelite/camera/find'),
    // modifycamera: require('../../app/api/airafacelite/camera/modify'),
    // removecamera: require('../../app/api/airafacelite/camera/remove'),
    // getcamerasnapshot: require('../../app/api/airafacelite/camerasnapshot/get'),

    // // V
    // createtablet: require('../../app/api/airafacelite/tablet/create'),
    // findtablet: require('../../app/api/airafacelite/tablet/find'),
    // modifytablet: require('../../app/api/airafacelite/tablet/modify'),
    // removetablet: require('../../app/api/airafacelite/tablet/remove'),
    // changeablet: require('../../app/api/airafacelite/tablet/change'),

    // // V
    // createvideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/create'),
    // findvideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/find'),
    // modifyvideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/modify'),
    // removevideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/remove'),

    // // V
    // querypersonverifyresult: require('../../app/api/airafacelite/verifyresult/queryperson'),
    // queryvisitorverifyresult: require('../../app/api/airafacelite/verifyresult/queryvisitor'),
    // querystrangerverifyresult: require('../../app/api/airafacelite/verifyresult/querystranger'),
    // fetchverifyphoto: require('../../app/api/airafacelite/verifyresult/fetchperson'),
    // addcommands: require('../../app/api/airafacelite/verifyresult/addcommands'),

    // // V
    // getdashboardsettings: require('../../app/api/airafacelite/dashboardsettings/get'),
    // setdashboardsettings: require('../../app/api/airafacelite/dashboardsettings/set'),

    // V
    gettimezonelist: require('../../app/api/airaconnect/systemsettings/timezonelist'),
    getdatetime: require('../../app/api/airaconnect/systemsettings/getdatetime'),
    setdatetime: require('../../app/api/airaconnect/systemsettings/setdatetime'),

    getsystemsettings: require('../../app/api/airaconnect/systemsettings/get'),
    setsystemsettings: require('../../app/api/airaconnect/systemsettings/set'),

    smtptest: require('../../app/api/airaconnect/systemsettings/smtptest'),

    // // V
    // getattendancesettings: require('../../app/api/airafacelite/attendancesettings/get'),
    // setattendancesettings: require('../../app/api/airafacelite/attendancesettings/set'),
    // manualclockin: require('../../app/api/airafacelite/manualclockinresult/manualclockin'),
    // querymanualclockinresult: require('../../app/api/airafacelite/manualclockinresult/query'),

    // // V
    // getmanagersettings: require('../../app/api/airafacelite/managersettings/get'),
    // setmanagersettings: require('../../app/api/airafacelite/managersettings/set'),

    // V
    querysystemlog: require('../../app/api/airaconnect/systemlog/query'),

    // V
    addlicense: require('../../app/api/airaconnect/license/add'),
    findlicense: require('../../app/api/airaconnect/license/find'),
    removelicense: require('../../app/api/airaconnect/license/remove'),
    defaultlicense: require('../../app/api/airaconnect/license/default'),

    // V
    findeventhandle: require('../../app/api/airaconnect/eventhandle/find'),
    createeventhandle: require('../../app/api/airaconnect/eventhandle/create'),
    modifyeventhandle: require('../../app/api/airaconnect/eventhandle/modify'),
    removeeventhandle: require('../../app/api/airaconnect/eventhandle/remove'),

    // 通知
    notifications: require('../../app/api/airaconnect/notifications/index'),
    marknotificationsasread: require('../../app/api/airaconnect/notifications/marknotificationsasread'),
    removenotifications: require('../../app/api/airaconnect/notifications/removenotifications'),

    // 環控監測
    createenvironmentcontrolpanelconfiguration: require('../../app/api/airaconnect/environmentcontrolpanelconfigurations/create'),
    environmentcontrolpanelconfigurations: require('../../app/api/airaconnect/environmentcontrolpanelconfigurations/index'),
    updateenvironmentcontrolpanelconfiguration: require('../../app/api/airaconnect/environmentcontrolpanelconfigurations/update'),
    deleteenvironmentcontrolpanelconfigurations: require('../../app/api/airaconnect/environmentcontrolpanelconfigurations/delete'),
  }

  return {
    publicCgi,
    router,
  }
}
