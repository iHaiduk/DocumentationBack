View = require("../views/Home")
UserModel = require("../models/User")
Page = require("../models/Page")

class HomeController
  home: null
  defaultPage: 1
  run: (req, res)->
    v = new View(res, 'index')
    defaultPage = HomeController::defaultPage
    Page.findOne({page_id: defaultPage}).exec (err, pages)->
      unless pages?
        baseText = [
          param: "text"
          code: """<p><sup>Hello to Documentation page!</sup></p><p>This is your first page.</p>"""
        ]
        page = new Page(
          page_id: defaultPage
          code: [
            param: "text"
            code: JSON.stringify baseText
          ]
        );
        page.save((err)->
          v.render(
            html: baseText
          )
          return
        )
      else
        console.log(JSON.parse pages.code)
        v.render(
          html: JSON.parse pages.code
        )
        return

  save: (req, res) ->
    if req.body? and req.body.code?
      v = new View(res)
      defaultPage = HomeController::defaultPage
      Page.findOne { page_id: defaultPage }, (err, page) ->
        page.code = req.body.code
        page.save (err) ->
          v.send answ: true
          return
        return
    return

module.exports = HomeController