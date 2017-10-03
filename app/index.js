const noble = require('noble');
const ziktoWalk = require('./const').ziktoWalk;

//noble.startScanning();
console.log(JSON.stringify(ziktoWalk,null,2));

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log('scanning...');
    noble.startScanning();;
  }
  else {
    noble.stopScanning();
    console.log("stop scanning");
  }
});

noble.on('discover', function(peripheral) {
  // we found a peripheral, stop scanning
  process.stdout.write("\n"+peripheral.advertisement.localName+'...');
  
  if(peripheral.advertisement.localName==='Zikto-walk'){
  	peripheral.connect((err) => {
  		
  		console.log("connected");
  		console.log("Available Services : ");
  		peripheral.discoverServices([],(err,services)=>{

  			services.forEach((s)=>{
  				console.log(s.uuid);
  			});
  		});
  	});
  }else{
  	console.log();
  }
});


