View = require("../views/Home")
UserModel = require("../models/User")
Page = require("../models/Page")

class HomeController
  home: null
  run: (req, res)->
    v = new View(res, 'index')

    ###page = new Page(
      page_id: 1
      code: """<div class="section">
                    <div class="sub-section">
                        <p>
                            <sup>Getting Started Sub</sup>
                        </p>
                        <p>
                            <sub>Getting Started Sub</sub>
                        </p>
                        <p>
                            Less is a CSS pre-processor, meaning that it extends the CSS language, adding features that allow variables, mixins, functions and many other techniques that allow you to make CSS that is more maintainable, themable and extendable.
                        </p>
                        <p>
                            Less runs inside Node, in the browser and inside Rhino. There are also many 3rd party tools that allow you to compile your files and watch for changes.
                        </p>
                        <p>
                            For example:
                        </p>
                    </div>
                </div>"""
    );
    page.save()###

    Page.findOne({page_id: 1}).exec (err, pages)->

      v.render(
        html: pages.code
      )
    return

  save: (req, res)->
    console.log(req.body)
    console.log(JSON.parse(req.body))
    if req.body[0]?
      code = req.body[0].code
      console.log(code)
      return
      Page.findOne({page_id: 1}, (err, page)->
        console.log(page, code)
        page.code = code
        page.save (err)->
          v = new View(res)
          console.log(result)
          v.send({answ: true})
    )

module.exports = HomeController