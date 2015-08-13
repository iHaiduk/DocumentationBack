var Routes, routes;

routes = {
  home: {
    type: 'get',
    link: '/',
    control: function(req, res) {
      HomeController.prototype.run(req, res);
    }
  },
  about: {
    type: 'get',
    link: '/about',
    control: function(req, res) {
      console.log('Page about');
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
      return;
    }
  };

  return Routes;

})();
