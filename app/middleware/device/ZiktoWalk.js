const AsyncBleDevice = require("./AsyncBleDevice");
const _ = require("lodash");


const ZiktoWalk = function(peripheral){
  AsyncBleDevice.call(this, peripheral);

};

sensorData = {};

ZiktoWalk.prototype = new AsyncBleDevice();

Protocol = {
  Link   : new Buffer([0x10, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  FindMe : new Buffer([0x70, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  Gait   : new Buffer([0x70, 0x05, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  GaitStop: new Buffer([0x71, 0x05, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
};

const protoFunc = (data,isNotification) => {

  let pData = parseArray(data);
  switch(pData[0]){
    case 0x71:
      sensorDataRead(pData);
      break;
    default:
      process.stdout.write("Received :: ");
      console.log(pData);
      break;

  }

};


const parseArray = (data) => {

  let newData = [];
  let i;
  for(i=0; i<(data.length-1); i++){
    if(data[i]==3) return new Buffer(data);
    if(data[i]==0xD0 && data[i+1]==0xD3){
      newData = [];
      newData.push(...data.slice(0,i));
      newData.push(3);
      newData.push(...data.slice(i+2,data.length));
      data = newData;
    }
  }
  return new Buffer (data);
};

const sensorDataRead = (d) => {
  let accelx = d.readInt16LE(2)/100;
  let accely = d.readInt16LE(4)/100;
  let accelz = d.readInt16LE(6)/100;
  let gyrox = d.readInt16LE(8);
  let gyroy = d.readInt16LE(10);
  let gyroz = d.readInt16LE(12);
  sensorData = {accelx,accely,accelz,gyrox,gyroy,gyroz};
  //console.log("[" + d[1] + "] " + accelx + "," + accely + "," + accelz);
};

ZiktoWalk.prototype = {
  init : async function(){
    await AsyncBleDevice.prototype.init.call(this);
    console.log("Done");
    this.serviceMain = _.filter(this.services,{'uuid':Gatt.serviceMain.uuid})[0];

    this.rwCharacteristics = _.filter(this.serviceMain.discoveredChars,{"uuid":Gatt.serviceMain.readWrite.uuid})[0];
    this.notiCharacteristics = _.filter(this.serviceMain.discoveredChars,{"uuid":Gatt.serviceMain.notify.uuid})[0];
    this.sensorData = {};
    this.notiCharacteristics.subscribe(err=>{
      if(err) console.log("Error");

      this.notiCharacteristics.on("data",protoFunc);
      console.log("Notification Enabled");
      console.log("Press F");
      return this;
    });
    return this;
  },

  findMe : function(){
    this.rwCharacteristics.write(Protocol.FindMe,false,(err) => {
      if(err) console.log("Error");
      else    console.log("Find me");
    });
    return;
  },

  startSampling: function(){
    this.rwCharacteristics.write(Protocol.Gait,false,(err) => {
      console.log( (err)? "Error" : "Lab starts" );
    });
    return;
  },

  stopSampling: function(){
    this.rwCharacteristics.write(Protocol.GaitStop,false,(err) => {
      console.log( (err)? "Error" : "Lab starts" );
    });
    return;
  },

  collectSensorData: function(){
    if(sensorData.accelx) return sensorData;
    else return {accelx:0, accely:0, accelz:0, gryox:0, gyroy:0, gyroz:0};


  }

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


ZiktoWalk.prototype.contructor = AsyncBleDevice;

module.exports = ZiktoWalk;
