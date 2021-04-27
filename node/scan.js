const express = require('express');
const router = express.Router();
const bleMiddleware = require('../app/middleware/index');

console.log("scan");
router.get('/*', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Credentials", true);

  var status;
  if(req.query.scan == "true"){
    status = bleMiddleware.ScanDevices();
  }else{
    status = bleMiddleware.StopScanDevices();
  }

  res.json( {status,
             connList:bleMiddleware.connList(),
             scanList:bleMiddleware.scanList()});

});
console.log(router);
console.log(router.route);

module.exports = router;
