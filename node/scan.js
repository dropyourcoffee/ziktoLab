const express = require('express');
const router = express.Router();
const bleMiddleware = require('../app/middleware');

router.all('/', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);

  let status;
  if(req.query.scan == "true"){
    status = bleMiddleware.ScanDevices();
  }else{
    status = bleMiddleware.StopScanDevices();
  }

  res.json( {status,
             scanList:bleMiddleware.scanList()});

});

module.exports = router;