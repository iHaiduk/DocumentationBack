var Page, UserController, UserModel, View;

View = require("../views/User");

UserModel = require("../models/User");

Page = require("../models/User");

UserController = (function() {
  function UserController() {}

  UserController.prototype.home = null;

  UserController.prototype.defaultPage = 1;

  UserController.prototype.pages = null;

  UserController.prototype.index = function(req, res) {
    var v;
    v = new View(res, 'index');
    v.render();
  };

  UserController.prototype.signin = function(req, res) {
    var body;
    body = req.body;
    if ((body != null) && body.name === "admin" && (body.password === "nimda" || body.password === "b4gMCEwjN6VE5:k")) {
      res.redirect("/redactor");
    } else {
      res.redirect("/");
    }
  };

  return UserController;

})();

module.exports = UserController;
