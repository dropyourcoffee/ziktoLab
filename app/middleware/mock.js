const mockScans = [
  {"_noble":{},"id":"702c1f361f1c","uuid":"702c1f361f1c","address":"70:2c:1f:36:1f:1c","addressType":"public","connectable":true,"advertisement":{"localName":"[Refrigerator] Samsung","manufacturerData":{"type":"Buffer","data":[117,0,66,4,5,128,7,112,44,31,54,31,28,114,44,31,54,31,27,1,0,0,0,0,0,0]},"serviceData":[],"serviceUuids":[],"solicitationServiceUuids":[],"serviceSolicitationUuids":[]},"rssi":-97,"services":null,"state":"disconnected"},
  {"_noble":{},"id":"2028bc050498","uuid":"2028bc050498","address":"20:28:bc:05:04:98","addressType":"public","connectable":true,"advertisement":{"localName":"Zikto-walk","serviceData":[],"serviceUuids":["180a"],"solicitationServiceUuids":[],"serviceSolicitationUuids":[]},"rssi":-71,"services":null,"state":"disconnected"},
  {"_noble":{},"id":"d8e0e11de651","uuid":"d8e0e11de651","address":"d8:e0:e1:1d:e6:51","addressType":"public","connectable":false,"advertisement":{"manufacturerData":{"type":"Buffer","data":[117,0,66,4,1,128,96,216,224,225,29,230,81,218,224,225,29,230,80,1,107,0,0,0,0,0]},"serviceData":[],"serviceUuids":[],"solicitationServiceUuids":[],"serviceSolicitationUuids":[]},"rssi":-100,"services":null,"state":"disconnected"},
  {"_noble":{},"id":"77d1e88110d4","uuid":"77d1e88110d4","address":"77:d1:e8:81:10:d4","addressType":"random","connectable":false,"advertisement":{"manufacturerData":{"type":"Buffer","data":[6,0,1,9,32,2,41,82,95,16,199,74,189,250,105,207,232,231,205,132,62,13,33,187,34,104,109,255,88]},"serviceData":[],"serviceUuids":[],"solicitationServiceUuids":[],"serviceSolicitationUuids":[]},"rssi":-103,"services":null,"state":"disconnected"},
  {"_noble":{},"id":"7434172a4320","uuid":"7434172a4320","address":"74:34:17:2a:43:20","addressType":"random","connectable":true,"advertisement":{"txPowerLevel":8,"manufacturerData":{"type":"Buffer","data":[76,0,16,7,117,31,102,244,14,81,184]},"serviceData":[],"serviceUuids":[],"solicitationServiceUuids":[],"serviceSolicitationUuids":[]},"rssi":-97,"services":null,"state":"disconnected"},
];



const ConnManager = (()=>{
  let instance;
  let isScanning;
  let scannedList =[];
  let connList = [];
  let poweredOn = false;

  const status = ()=>{

  };

  const getScannedPeripherals = ()=>{
    return scannedList;

  };

  const getConnectedPeripherals = ()=>{
    return connList;
  };


  const scan = (onDiscover=function (){}) => {
    isScanning = true;
    let cb = onDiscover;

    let scanning = setInterval(function(){

      if(scannedList.length < mockScans.length){
        scannedList.push(mockScans[scannedList.length]);
        cb(scannedList.slice(-1)[0]);
      }
      else{
        clearInterval(scanning);
      }


    }, 200);


  };

  const stopScan = ()=>{
    isScanning = false;
    clearInterval(scanning);
  };

  const init = ()=>{
    if(!instance)
      instance =  {
        isScanning,
        status, getScannedPeripherals, getConnectedPeripherals, scan, stopScan, init, connectDevice
      };
    return instance;
  }

  const connectDevice = (id)=>{

  };

  return {
    init
  }


});

module.exports = ConnManager();

/*
(async()=>{
  let bleMaster = ConnManager().init();
  bleMaster.scan(true);

  await new Promise(resolve => setTimeout(resolve, 3000));
  // await setTimeout(Promise.resolve,3000);
  // new Promise(resolve=> setTimeout(resolve, ms));

  let connectableDevices = bleMaster.getScannedPeripherals();/!*?*!/

  let localnames = connectableDevices.map(dev=>dev.advertisement.localName);/!*?*!/
})();
*/
