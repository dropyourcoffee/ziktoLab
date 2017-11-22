const noble = require('noble');
const ziktoWalk = require('./const').ziktoWalk;
const asyncBLE = require('./middleware').asyncBLE
const _ = require('lodash');

//noble.startScanning();

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    process.stdout.write('scanninggg ');
    noble.startScanning();;
  }
  else {
    noble.stopScanning();
    console.log("stop scanning");
  }
});

noble.on('discover', async function(peripheral) {
  
  if(peripheral.advertisement.localName==='Zikto-walk' && peripheral.rssi > -60){
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

    /*noble.write(peripheral.uuid, ziktoWalk.Gatt.serviceMain.uuid, ziktoWalk.Gatt.serviceMain.readWrite.uuid,findme,false,(err)=>{
  	  if(err) console.log("Error");
  	  console.log("Done");
    });*/


  }

});


