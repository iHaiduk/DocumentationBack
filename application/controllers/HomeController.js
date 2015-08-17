var HomeController, Page, UserModel, View;

View = require("../views/Home");

UserModel = require("../models/User");

Page = require("../models/Page");

HomeController = (function() {
  function HomeController() {}

  HomeController.prototype.home = null;

  HomeController.prototype.defaultPage = 1;

  HomeController.prototype.run = function(req, res) {
    var defaultPage, v;
    v = new View(res, 'index');
    defaultPage = HomeController.prototype.defaultPage;
    return Page.findOne({
      page_id: defaultPage
    }).exec(function(err, pages) {
      var baseText, page;
      if (pages == null) {
        baseText = [
          {
            param: "text",
            code: "<p><sup>Hello to Documentation page!</sup></p><p>This is your first page.</p>"
          }
        ];
        page = new Page({
          page_id: defaultPage,
          code: [
            {
              param: "text",
              code: JSON.stringify(baseText)
            }
          ]
        });
        return page.save(function(err) {
          v.render({
            html: baseText
          });
        });
      } else {
        console.log(JSON.parse(pages.code));
        v.render({
          html: JSON.parse(pages.code)
        });
      }
    });
  };

  HomeController.prototype.save = function(req, res) {
    var defaultPage, v;
    if ((req.body != null) && (req.body.code != null)) {
      v = new View(res);
      defaultPage = HomeController.prototype.defaultPage;
      Page.findOne({
        page_id: defaultPage
      }, function(err, page) {
        page.code = req.body.code;
        page.save(function(err) {
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
