const assert = require("assert");
const events = require("events");

const onData = new events.EventEmitter();

const Ziktowalk = function(peripheral){
  this._peripheral = peripheral;

};

Ziktowalk.prototype.init = async function(){
  let {services} = await this._peripheral.discoverAllServicesAndCharacteristicsAsync();
  this._services = services;


  let dataProtocol = this._services.find(g=> g.uuid.startsWith("0000f0f0"));
  assert(dataProtocol, "DataProtocol Service Not Found");

  this.dataSend = dataProtocol.characteristics.find(ch=> ch.uuid.startsWith("0000f0f1"));
  assert(this.dataSend, "rw Characteristic in DataProtocol Service Not Found");

  this.dataFeed = dataProtocol.characteristics.find(ch=> ch.uuid.startsWith("0000f0f2"));
  assert(this.dataFeed, "noti characteristic in DataProtocol Service Not Found");

  this.dataFeed.subscribe(err=>{
    if(err) console.log("Error");

    this.dataFeed.on("data",_protoFunc.bind(this));
    return this;
  });

  return this;

};

_protoFunc = function(data, isNoti){

  let pData = _parseArray(data);

  switch(pData[0]){
    case 0x71:
      this.onData && this.onData(sensorData(pData));
      break;
    default:
      process.stdout.write("Received :: ");
      break;

  }

};

const sensorData = (d) => {
  let accelx = d.readInt16LE(2)/100;
  let accely = d.readInt16LE(4)/100;
  let accelz = d.readInt16LE(6)/100;
  let gyrox = d.readInt16LE(8);
  let gyroy = d.readInt16LE(10);
  let gyroz = d.readInt16LE(12);

  return {accelx, accely, accelz, gyrox, gyroy, gyroz};
};

const _parseArray = (data) => {

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
  return new Buffer(data);
};


Ziktowalk.prototype.findMe = function(){
  console.log('send findme')
  console.log(this.dataSend)
  this.dataSend.write(_Protocol.FindMe, false);
};

Ziktowalk.prototype.startSampling = function(cb){

  this.onData = cb;
  this.dataSend.write(_Protocol.Gait, false,(err) => {
    console.log( err? "Error" : "Lab starts sampling" );
  });

};

Ziktowalk.prototype.stopSampling = function(){
  this.dataSend.write(_Protocol.GaitStop, false, err=>{
    console.error( err? "Error" : "Lab failed to stop sampling")
  })
};


const _Protocol = {
  Link   :  Buffer.from([0x10, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  FindMe :  Buffer.from([0x70, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  Gait   :  Buffer.from([0x70, 0x05, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
  GaitStop: Buffer.from([0x71, 0x05, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
};


module.exports = Ziktowalk;