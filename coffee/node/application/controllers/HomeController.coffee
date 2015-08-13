View = require("../views/Home")
HomeModel = require("../models/Home")
HomeSocket = require("../socket/HomeSocket")

class HomeController
  run: (req, res)->
    v = new View(res, 'index')

    new HomeSocket()

    HomeModel.find().exec (err, home)->
      v.render(
        title: "Hello World!"
      )
    return

module.exports = HomeController