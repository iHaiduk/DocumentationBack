var HomeController, Page, UserModel, View;

View = require("../views/Home");

UserModel = require("../models/User");

Page = require("../models/Page");

HomeController = (function() {
  function HomeController() {}

  HomeController.prototype.home = null;

  HomeController.prototype.run = function(req, res) {
    var v;
    v = new View(res, 'index');

    /*page = new Page(
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
    page.save()
     */
    Page.findOne({
      page_id: 1
    }).exec(function(err, pages) {
      return v.render({
        html: pages.code
      });
    });
  };

  HomeController.prototype.save = function(req, res) {
    var code;
    if (req.body != null) {
      code = req.body.code.code;
      return Page.findOne({
        page_id: 1
      }, function(err, page) {
        console.log(page, code);
        page.code = code;
        page.save(function(err) {
          var v;
          v = new View(res);
          console.log(result);
          v.send({
            answ: true
          });
        });
      });
    }
  };

  return HomeController;

})();

module.exports = HomeController;
