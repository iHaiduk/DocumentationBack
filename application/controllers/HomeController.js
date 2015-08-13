var HomeController, HomeModel, HomeSocket, View;

View = require("../views/Home");

HomeModel = require("../models/Home");

HomeSocket = require("../socket/HomeSocket");

HomeController = (function() {
  function HomeController() {}

  HomeController.prototype.run = function(req, res) {
    var v;
    v = new View(res, 'index');
    new HomeSocket();
    HomeModel.find().exec(function(err, home) {
      return v.render({
        title: "Hello World!"
      });
    });
  };

  return HomeController;

})();

module.exports = HomeController;
