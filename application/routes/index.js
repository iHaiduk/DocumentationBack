var Routes, routes;

routes = {
  home: {
    type: 'get',
    link: '/',
    control: function(req, res) {
      HomeController.prototype.run(req, res);
    }
  },
  save: {
    type: 'post',
    link: '/save',
    control: function(req, res) {
      HomeController.prototype.save(req, res);
    }
  }
};

module.exports = Routes = (function() {
  function Routes() {}

  Routes.prototype.init = function(app) {
    var i, page;
    for (i in routes) {
      page = routes[i];
      console.log(page);
      app[page.type](page.link, page.control);
    }
  };

  return Routes;

})();
