const express = require('express');
const router = express.Router();
const bleMiddleware = require('../app/middleware');
const _ = require("lodash");
//const scanList = require('../app/middleware').ScanList;
//const connList = require('../app/middleware').ConnList;

router.all('/', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);

  res.json( {status:bleMiddleware.ScanDevices(),
             scanList:bleMiddleware.scanList()});

});

module.exports = router;