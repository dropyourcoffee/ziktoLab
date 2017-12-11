const express = require('express');
const router = express.Router();
const bleMiddleware = require('../app/middleware');
const _ = require("lodash");

router.all('/', async function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);

  let deviceSel = parseInt(req.query.connId);

  await bleMiddleware.connectDevice(deviceSel);
  res.json( {connList:bleMiddleware.connList(),
             scanList:bleMiddleware.scanList()});

});

module.exports = router;