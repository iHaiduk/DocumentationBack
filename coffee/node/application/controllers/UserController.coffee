View = require("../views/User")
UserModel = require("../models/User")
Page = require("../models/User")

class UserController
  home: null
  defaultPage: 1
  pages: null
  index: (req, res)->
    req.session.role = 'user'
    v = new View(res, 'index')
    v.render()
    return
  signin: (req, res)->
    body = req.body
    if body? and body.name is "admin" and (body.password is "nimda" or body.password is "b4gMCEwjN6VE5:k")
      req.session.role = 'moder'
      res.redirect("/redactor")
    else
      req.session.role = 'user'
      res.redirect "/redactor"
    return

module.exports = UserController