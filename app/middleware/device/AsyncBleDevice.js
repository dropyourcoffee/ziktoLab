const asyncBLE = require('./..').asyncBLE;


const AsyncBleDevice = function(peripheral){
  this._peripheral = peripheral;
  this.services = [];
};

AsyncBleDevice.prototype = {

  init : async function(){
    console.log("initializing..");
    //console.log(asyncBLE);
    this.services = await asyncBLE.DiscoverServices(this._peripheral);
  },


};





module.exports = AsyncBleDevice;