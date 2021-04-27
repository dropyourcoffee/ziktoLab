const noble = require('noble');
const ZiktoWalk = require('./const').ziktowalk;
noble.startScanning();
console.log(ZiktoWalk);


noble.on('stateChange',(state)=>{
    if(state === 'poweredOn') {
        console.log('scanning...');
        soble.startScanning(ZiktoWalk)
    }
    
    
    
    

});


noble.on('discover', (peripheral) => {
	
    noble.stopScanning();
    console.log('Found peripheral : ' + peripheral.advertisement);

    peripheral.connect((err)=> {

    });
    
    
});

var express = require("express");
var app = express();
module.exports = app;

