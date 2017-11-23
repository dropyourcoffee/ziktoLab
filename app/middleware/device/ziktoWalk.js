const AsyncBleDevice = require("./AsyncBleDevice");
const _ = require("lodash");


const ZiktoWalk = function(peripheral){
  AsyncBleDevice.call(this, peripheral);

};

ZiktoWalk.prototype = new AsyncBleDevice();


ZiktoWalk.prototype.init = async function(){
  await AsyncBleDevice.prototype.init.call(this);
  console.log("Done");
  this.serviceMain = _.filter(this.services,{'uuid':Gatt.serviceMain.uuid})[0];

  this.rwCharacteristics = _.filter(this.serviceMain.discoveredChars,{"uuid":Gatt.serviceMain.readWrite.uuid})[0];
  this.notiCharacteristics = _.filter(this.serviceMain.discoveredChars,{"uuid":Gatt.serviceMain.notify.uuid})[0];

  this.notiCharacteristics.subscribe(err=>{
    if(err) console.log("Error");

    this.notiCharacteristics.on("data",(data,isNotification) => {
      process.stdout.write("Data Received :: ")
      data.forEach((d)=>{
        process.stdout.write(d.toString(16)+" ");
        });
      process.stdout.write("\n");
    });
    console.log("Notification Enabled");
    return;
  });

};


Gatt = {
  serviceMain : {
    uuid : '0000f0f01212efde1523785feabcd123',
    readWrite : {
      uuid: '0000f0f11212efde1523785feabcd123',
    },
    notify : {
      uuid: '0000f0f21212efde1523785feabcd123',
    }
  },

  serviceDevInfo : {
    uuid : '180a',
    serialNo:{
      uuid: '2a25',
    }
  }
};

ZiktoWalk.Protocol = {
  Link   : new Buffer([0x10, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  FindMe : new Buffer([0x70, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
};

ZiktoWalk.prototype.contructor = AsyncBleDevice;

module.exports = ZiktoWalk;
