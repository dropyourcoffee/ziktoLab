var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.redirect("/html/dashboard.html");
});

router.get('/html', function(req, res, next) {
  res.redirect("/html/dashboard.html");
});

module.exports = router;


