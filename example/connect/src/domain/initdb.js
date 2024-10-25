module.exports = () => {
  async function init() {
    const { db, defaultdata } = global.spiderman

    let test = null
    test = db.account.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default account created',
      )
      db.account.set(defaultdata.account)
    }

    test = db.serverprofile.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default serverprofile created',
      )
      db.serverprofile.set(defaultdata.serverprofile)
    }

    test = db.devicetype.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicetype created',
      )
      db.devicetype.set(defaultdata.devicetype)
    }

    test = db.devicegroup.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicegroup created',
      )
      db.devicegroup.set(defaultdata.devicegroup)
    }

    test = db.devicesenv.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicesenv created',
      )
      db.devicesenv.set(defaultdata.devicesenv)
    }

    test = db.devicesmac.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicesmac created',
      )
      db.devicesmac.set(defaultdata.devicesmac)
    }

    test = db.devicesair.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicesair created',
      )
      db.devicesair.set(defaultdata.devicesair)
    }

    test = db.devicesele.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicesele created',
      )
      db.devicesele.set(defaultdata.devicesele)
    }

    test = db.devicesgate.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicesgate created',
      )
      db.devicesgate.set(defaultdata.devicesgate)
    }

    test = db.devicescomm.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default devicescomm created',
      )
      db.devicescomm.set(defaultdata.devicescomm)
    }

    test = db.map.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default map created',
      )
      db.map.set(defaultdata.map)
    }

    test = db.eventhandle.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default eventhandle created',
      )
      db.eventhandle.set(defaultdata.eventhandle)
    }

    // test = db.systemlog.find();
    // if (test == null || test.length === 0) {
    //   global.spiderman.systemlog.writeInfo('domain initdb init default systemlog created');
    //   db.systemlog.set(defaultdata.systemlog);
    // }

    test = db.operationcase.find()
    if (test == null || test.length === 0) {
      global.spiderman.systemlog.writeInfo(
        'domain initdb init default operationcase created',
      )
      db.operationcase.set(defaultdata.operationcase)
    }

    // test = db.videodevicegroups.find();
    // if (test == null || test.length === 0) db.videodevicegroups.set(defaultdata.videodevicegroups);

    // test = db.outputdevicegroups.find();
    // if (test == null || test.length === 0) {
    //   db.outputdevicegroups.set(defaultdata.outputdevicegroups);
    // }

    // test = db.dashboardsettings.find();
    // if (test == null || test.length === 0) db.dashboardsettings.set(defaultdata.dashboardsettings);

    // test = db.attendancesettings.find();
    // if (test == null || test.length === 0) {
    //   db.attendancesettings.set(defaultdata.attendancesettings);
    // }

    // test = db.managersettings.find();
    // if (test == null || test.length === 0) db.managersettings.set(defaultdata.managersettings);

    // test = db.person.find();
    // if (test == null || test.length === 0) db.person.set([]);

    // test = db.cameras.find();
    // if (test == null || test.length === 0) db.cameras.set([]);

    // test = db.tablets.find();
    // if (test == null || test.length === 0) db.tablets.set([]);

    // test = db.wiegandconverters.find();
    // if (test == null || test.length === 0) db.wiegandconverters.set([]);

    // test = db.ioboxes.find();
    // if (test == null || test.length === 0) db.ioboxes.set([]);
  }

  return {
    init,
  }
}
