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
  	console.log("peri uuid :: " + peripheral.uuid);

  	serviceMain = await asyncBLE.DiscoverServices(peripheral);
  	serviceMain = _.filter(serviceMain,{'uuid':ziktoWalk.Gatt.serviceMain.uuid});


  	const chars = await asyncBLE.DiscoverCharacteristics(peripheral);
  	//console.log("m"+ziktoWalk.serviceMain.readWrite.uuid);
  	const rwCharacteristics = _.filter(chars,{'uuid':ziktoWalk.Gatt.serviceMain.readWrite.uuid});
  	console.log(rwCharacteristics);

  	const findme = new Buffer(20);
  	findme.writeUInt8(0x70,0);
  	findme.writeUInt8(0x01,1);
  	findme.writeUInt8(0x03,2);
  	console.log(findme);
  	noble.write(peripheral.uuid, ziktoWalk.Gatt.serviceMain.uuid, ziktoWalk.Gatt.serviceMain.readWrite.uuid,findme,false)


  }

});


noble.on
