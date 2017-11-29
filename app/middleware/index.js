
const noble = require('noble');
const readline = require('readline');
const ZiktoWalk = require("./device").ZiktoWalk;
const asyncBLE = require("./ble-promise");
const _ = require("lodash");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


let ScanList = [];
let ConnList = [];
let Status;
let IsScanning = ""


displayMenu = () => {
  console.log("Press 's' to scan BLE Devices");
};


noble.on('stateChange', function(state) {
  Status = state;
  process.stdin.on('keypress', async (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {

      switch(key.name){
        case 's':
          ScanList = [];
          if (state === "poweredOn"){
            noble.startScanning();
            console.log("Scanning...");

          }else{
            console.log("Not Powered On");
          }
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          noble.stopScanning();
          let deviceSel = parseInt(key.name);
          if(deviceSel > ScanList.length){
            console.log("Device ["+deviceSel+"] is not defined.");
          }else{
            //console.log(scanList[deviceSel]);
            let connected = await asyncBLE.Connect(ScanList[deviceSel]);
            //ConnList.push(connected);

            if(connected.advertisement.localName === "Zikto-walk"){
              let target = new ZiktoWalk(connected);
              await target.init();
              ConnList.push(target);
            }
          }
          break;
        case "c":
          process.stdout.write("\nConnected List : [");

          ConnList.forEach((c)=>{
            process.stdout.write(c.advertisement.localName+" ");
          });
          process.stdout.write("]");
          break;
        case "f": // FindMe
          if(ConnList[0].deviceType==="Zikto-walk") ConnList[0].findMe();
          break;
        case "g": // Gait
          if(ConnList[0].deviceType==="Zikto-walk") ConnList[0].gait();
          break;
        case 'q':
          process.exit();
          break;
        default:
          console.log(key.name);

      }
    }
  });
  displayMenu();

});


noble.on('discover', async function(peripheral) {

  if(ScanList.length === 0 ) console.log("=======\nPress the device number to connect");
  ScanList.push(peripheral);
  console.log("[" + (ScanList.length-1) + "] : " + peripheral.advertisement.localName + " " + peripheral.address + " ("+peripheral.rssi+"dBm)");
  //console.log(peripheral.advertisement);
  //console.log(peripheral.address);

});

noble.on('scanStart', function(){
  IsScanning = true;
});

noble.on('scanStop', function(){
  IsScanning = false;
});

module.exports = {
	noble,
  status(){return Status},
  scanList(){
    let list = _.map(ScanList,'advertisement');
    return list;
  },
  ScanDevices(){

    if(IsScanning) {
      return "Scanning...";
    }else{
      console.log("Scanning Starts..");
      ScanList = [];
      noble.startScanning();
      "Idle...";
    }
  },

}