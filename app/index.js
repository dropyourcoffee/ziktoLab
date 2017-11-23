const noble = require('noble');
//const ziktoWalk = require('./const').ziktoWalk;
const asyncBLE = require('./middleware').asyncBLE;
const _ = require('lodash');
const readline = require('readline');
//const AsyncBleDevice = require("./middleware/device").AsyncBleDevice;
const ZiktoWalk = require("./middleware/device").ZiktoWalk;


readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


let ScanList = [];
let ConnList = [];

displayMenu = () => {
  console.log("Press 's' to scan BLE Devices");
};

noble.on('stateChange', function(state) {
  process.stdin.on('keypress', async (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {

      switch(key.name){
        case 's':
          scanList = [];
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
        case "f":
          ConnList[0].findMe();
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


  //console.log(peripheral.address);
  /*if(peripheral.advertisement.localName==='Zikto-walk' && peripheral.rssi > -60){
    process.stdout.write(peripheral.advertisement.localName+'...');
    console.log(peripheral.rssi);

    peripheral = await asyncBLE.Connect(peripheral);

  	serviceMain = await asyncBLE.DiscoverServices(peripheral);
  	serviceMain = _.filter(serviceMain,{'uuid':ziktoWalk.Gatt.serviceMain.uuid})[0];

  	//let chars = await asyncBLE.DiscoverCharacteristicsByService(serviceMain);
  	let chars = await asyncBLE.DiscoverCharacteristicsByPeripheral(peripheral);

  	let rwCharacteristics = _.filter(chars,{"uuid":ziktoWalk.Gatt.serviceMain.readWrite.uuid})[0];
  	let notiCharacteristics = _.filter(chars,{"uuid":ziktoWalk.Gatt.serviceMain.notify.uuid})[0];

  	const findme = ziktoWalk.Protocol.FindMe;
  	notiCharacteristics.subscribe(err=>{
  	  if(err) console.log("Error");

      notiCharacteristics.on("data",(data,isNotification) => {
        data.forEach((d)=>{
          process.stdout.write(d.toString(16)+" ");
        });
        process.stdout.write("\n");
      });


      rwCharacteristics.write(findme,false,(err)=>{
        if(err) console.log("Error");
        console.log("Done");

      });
    });

    //noble.write(peripheral.uuid, ziktoWalk.Gatt.serviceMain.uuid, ziktoWalk.Gatt.serviceMain.readWrite.uuid,findme,false,(err)=>{
  	  //if(err) console.log("Error");
  	  //console.log("Done");
    //});


  }*/

});


