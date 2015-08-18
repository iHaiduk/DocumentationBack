var filename, path;

path = require('path');

filename = path.parse(__filename);

module.exports = function(response, template) {
  if (template == null) {
    template = "index";
  }
  this.name = filename.name;
  this.response = response;
  this.template = this.name + "/" + template;
};

module.exports.prototype = {
  extend: function(properties) {
    var Child, key;
    Child = module.exports;
    Child.prototype = module.exports.prototype;
    for (key in properties) {
      Child.prototype[key] = properties[key];
    }
    return Child;
  },
  send: function(data) {
    return this.response.json(data);
  },
  render: function(data) {
    if (this.response && this.template) {
      this.response.render(this.template, data);
    }
  },
  getHtml: function(data, cb) {
    var _this;
    _this = this;
    if (this.response && this.template) {
      this.response.render(this.template, data, function(err, html) {
        if (typeof cb === "function") {
          cb(html);
        } else {
          _this.response.writeHead(200, {
            'Content-Type': 'text/html'
          });
          _this.response.write(html);
          _this.response.end();
        }
      });
    }
  }
};
