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
  },
  cancel: {
    type: 'get',
    link: '/cancel',
    control: function(req, res) {
      HomeController.prototype.cancel(req, res);
    }
  }
};

module.exports = Routes = (function() {
  function Routes() {}

  Routes.prototype.init = function(app) {
    var i, page;
    for (i in routes) {
      page = routes[i];
      app[page.type](page.link, page.control);
    }
  };

  return Routes;

})();
