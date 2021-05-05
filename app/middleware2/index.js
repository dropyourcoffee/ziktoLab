const noble = require('@abandonware/noble');
const Ziktowalk = require("./device/Ziktowalk");

const ConnManager = (()=>{
  let instance;
  let isScanning;
  let scannedList =[];
  let connList = [];
  let poweredOn = false;
  let _state;



  const getScannedPeripherals = ()=>{
    return scannedList;

  };

  const getConnectedDevices = ()=>{
    return connList;
  };


  const scan = (cb=function (){}) => {
    console.log(_state);

    isScanning = true;

    noble.on("discover", cb);
    noble.startScanning(['180a'], false);

  };

  const stopScan = ()=>{
    isScanning = false;
    clearInterval(scanning);
  };

  const init = async ()=>{

    await new Promise((resolve )=>{

      noble.on('stateChange', state=>{
        _state = state;
        resolve(true);
      });

    });

    if(!instance)
      instance =  {
        isScanning, _state,
        getScannedPeripherals, getConnectedDevices, scan, stopScan, init
      };

    return instance;
  };

  return {
    init
  };


});

exports.default = ConnManager();
// (async ()=>{
//   let bleMaster = ConnManager();
//   let bm = await bleMaster.init();
//
//   bm.scan(periph=>{
//
//     console.log(periph.advertisement);
//
//     periph.connectAsync()
//       .then(async ()=>{
//         console.log('connected')
//
//         let myDevice = new Ziktowalk(periph);
//         await myDevice.init()
//
//         const cb = data => {
//           if (!cb.cnt) cb.cnt = 0;
//           const sec = new Date().getSeconds();
//
//           if (cb.sec !== sec){
//             console.log(`Collecting data in ${cb.cnt} Hz...`);
//             cb.cnt = 0;
//             cb.sec = sec;
//           }
//           else
//             cb.cnt++;
//
//
//         };
//
//         myDevice.startSampling(cb);
//
//       })
//   });
//
// })();
