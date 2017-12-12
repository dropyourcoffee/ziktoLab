const routes = require('../routes/index');
const path = require("path");
//const logger = require('morgan');
const scan = require('../node/scan');
const conn = require('../node/conn');
const command = require('../node/command');

//-
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '500mb',parameterLimit : 100000000000 ,extended: true}));
app.use('/html',express.static('./html'));
app.use('/libs',express.static('./libs'));

app.use('/',routes);
app.use('/bower_components',  express.static(__dirname + '/../bower_components'));
app.use('/scan',scan);
app.use('/conn',conn);
app.use('/command',command);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;