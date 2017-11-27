const fs = require('fs');

_exports = {};
files = fs.readdirSync(__dirname);

files.forEach(function(file) {
    if(file !== "index.js" && file.includes(".js")) {
      _exports[file.split(".js")[0]] = require(__dirname+"/"+file);
    }

});

module.exports = _exports;
