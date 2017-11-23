const asyncBLE = require("./..").asyncBLE;
const _ = require("lodash");


const AsyncBleDevice = function(peripheral){
  this._peripheral = peripheral;
  this.services = [];
};

AsyncBleDevice.prototype = {

  init : async function(){
    this.services = await asyncBLE.DiscoverServices(this._peripheral);

    let i;
    for(i=0; i<this.services.length; i++){
      chars = await asyncBLE.DiscoverCharacteristicsByService(this.services[i]);
      this.services[i].discoveredChars = chars;
    }

  },


};





module.exports = AsyncBleDevice;