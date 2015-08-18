var HomeController, Page, UserModel, View;

View = require("../views/Home");

UserModel = require("../models/User");

Page = require("../models/Page");

HomeController = (function() {
  function HomeController() {}

  HomeController.prototype.home = null;

  HomeController.prototype.defaultPage = 3;

  HomeController.prototype.pages = null;

  HomeController.prototype.run = function(req, res) {
    var defaultPage, v;
    v = new View(res, 'index');
    defaultPage = HomeController.prototype.defaultPage;
    Page.findOne({
      page_id: defaultPage
    }).exec(function(err, pages) {
      var baseText, page;
      if (pages == null) {
        HomeController.prototype.pages = pages;
        baseText = [
          {
            param: "text",
            code: "<p><sup>Hello to Documentation page!</sup></p><p>This is your first page.</p>"
          }
        ];
        page = new Page({
          page_id: defaultPage,
          code: JSON.stringify(baseText)
        });
        page.save(function(err) {
          v.render({
            html: baseText
          });
        });
      } else {
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

  HomeController.prototype.cancel = function(req, res) {
    var defaultPage;
    defaultPage = HomeController.prototype.defaultPage;
    Page.findOne({
      page_id: defaultPage
    }).exec(function(err, pages) {
      var v;
      if (pages != null) {
        v = new View(res, '../_includes/sectionGenerate');
        v.getHtml({
          html: JSON.parse(pages.code)
        });
      }
    });
  };

  return HomeController;

})();

module.exports = HomeController;
