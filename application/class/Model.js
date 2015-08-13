var Schema, mongoose;

mongoose = require("mongoose");

Schema = mongoose.Schema;

module.exports = function(model_name, params) {
  var mongooseModel;
  mongooseModel = new Schema(params);
  return mongoose.model(model_name, mongooseModel);
};
