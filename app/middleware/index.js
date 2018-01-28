
const noble = require('noble');
const readline = require('readline');
const ZiktoWalk = require("./device").ZiktoWalk;
const asyncBLE = require("./ble-promise");
const _ = require("lodash");
const keyListen = require('events');

keyListen.EventEmitter.prototype.setmaxListener = 2;


readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


let ScanList = [];
let ConnList = [];
let Status;
let IsScanning = "";
let dotdotdot = 0;


const displayMenu = () => {
  console.log("Press 's' to scan BLE Devices");
};

const connectDevice = async function(id){
  let deviceSel = parseInt(id);
  let msg;
  if(deviceSel > ScanList.length){
    msg = "Device ["+deviceSel+"] is not defined.";
    console.log(msg);
  }else{
    let connected = await asyncBLE.Connect(ScanList[deviceSel]);

    if(connected.advertisement.localName === "Zikto-walk"){
      let target = new ZiktoWalk(connected);
      await target.init();
      ScanList.splice(parseInt(id),1);
      target.findMe();
      ConnList.push(target);
    }
    msg = "Connected '" + connected.advertisement.localName + "'";
    console.log(msg);

  }
  return msg;
};

const execCommand = async function(connid, func){
  ConnList[connid][func]();
};

const getSensorData = function(connid){
  return ConnList[connid].collectSensorData();
};

noble.on('stateChange', function(state) {
  Status = state;
  //console.log(keyListen.listenerCount(process.stdin,"keypress")+" listeners");
  if(!keyListen.listenerCount(process.stdin,"keypress")) {
    process.stdin.on('keypress', async (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else {

        switch (key.name) {
          case 's':
            ScanList = [];
            if (state === "poweredOn") {
              noble.startScanning();
              console.log("Scanning...");

            } else {
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
            connectDevice(parseInt(key.name));
            break;
          case "x":
            process.stdout.write("\nScanned List : [");

            ScanList.forEach((s) => {
              process.stdout.write(s.advertisement.localName + " ");
            });
            process.stdout.write("]");
            break;

          case "c":
            process.stdout.write("\nConnected List : [");

            ConnList.forEach((c) => {
              process.stdout.write(c.deviceType + " ");
            });
            process.stdout.write("]");
            break;
          case "f": // FindMe
            if (ConnList[0].deviceType === "Zikto-walk") ConnList[0].findMe();
            break;
          case "g": // Gait
            if (ConnList[0].deviceType === "Zikto-walk") ConnList[0].startSampling();
            break;
          case "h":
            if (ConnList[0].deviceType === "Zikto-walk") ConnList[0].stopSampling();
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
  }
});


noble.on('discover', async function(peripheral) {

  if(ScanList.length === 0 ) console.log("=======\nPress the device number to connect");
  ScanList.push(peripheral);
  console.log("[" + (ScanList.length-1) + "] : " + peripheral.advertisement.localName + " " + peripheral.address + " ("+peripheral.rssi+"dBm)");

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
    //let list = _.map(ScanList,'advertisement');
    let list = _.map(ScanList, _.partial(_.ary(_.pick, 2), _, ['advertisement','address']));
    return list;
  },
  connList(){
    let list = [];
    ConnList.forEach((c) => {
      //console.log(c.findMe);
      var deviceCmd = Object.getOwnPropertyNames(Object.getPrototypeOf(c));

      deviceCmd = _.pull(deviceCmd, 'init', 'contructor', 'collectSensorData'); // Available Methods varies by deviceTypes
      //c[deviceCmd[1]]();
      list.push({peripheral: c._peripheral.advertisement, cmds:deviceCmd});
    });
    return list;
  },
  ScanDevices(){
    if(IsScanning) {
      let statmsg = "Scanning";
      dotdotdot = (dotdotdot+1)%4;
      for(i=0; i<dotdotdot; i++) statmsg += ".";
      return statmsg;
    }else{
      console.log("Scanning Starts..");
      ScanList = [];
      noble.startScanning();
      return "Idle...";
    }
  },
  StopScanDevices(){
    console.log("Scanning Stops..");
    noble.stopScanning();
    return "Stopped";
  },
  connectDevice,
  execCommand,
  getSensorData,
};

