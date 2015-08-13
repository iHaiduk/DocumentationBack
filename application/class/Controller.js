var Controllers, dir, fs, path;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

fs = require('fs');

path = require('path');

dir = __dirname + '/../controllers';

Controllers = (function() {
  function Controllers() {}

  Controllers.prototype.init = function() {
    fs.readdir(dir, function(err, files) {
      if (err) {
        throw err;
      }
      files.forEach(function(file) {
        file = path.parse(file, '.js');
        if (file.name === "index") {
          return;
        }
        global[file.name.capitalize()] = require(dir + "/" + file.name);
      });
    });
  };

  return Controllers;

})();

module.exports = Controllers;
