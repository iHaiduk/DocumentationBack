var mongoose;

mongoose = require('mongoose');

module.exports = function(config) {
  var base, i, results;
  if (config != null) {
    results = [];
    for (i in config.dataBase) {
      base = config.dataBase[i];
      if ((base != null) && i === "mongo") {
        results.push(mongoose.connect('mongodb://' + ((base.user != null) && base.user !== "" ? base.user + ':' + base.password + '@' : "") + base.host + ':' + base.port + '/' + base.table, function(err, db) {
          if (err != null) {
            return console.log(err);
          }
          console.log('Successfully connected to mongodb://' + ((base.user != null) && base.user !== "" ? base.user + ':' + base.password + '@' : "") + base.host + ':' + base.port + '/' + base.table);
        }));
      } else {
        results.push(void 0);
      }
    }
    return results;
  }
};
