var HomeModel, HomeSocket, Socket,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

HomeModel = require("../models/Home");

Socket = require("../class/Socket");

HomeSocket = (function(superClass) {
  extend(HomeSocket, superClass);

  function HomeSocket() {
    return HomeSocket.__super__.constructor.apply(this, arguments);
  }

  HomeSocket.prototype.init = function() {
    if (this.isConnected()) {
      socketIo.emit('news', {
        hello: 'world'
      });
      socketIo.on('add_new_row', function(msg) {
        var test;
        test = new HomeModel(msg.my);
        test.save(function(err, history) {
          socketIo.emit('add_new_row_added', {
            result: true,
            data: history
          });
          socketIo.broadcast.emit('add_new_row_added', {
            result: true,
            data: history
          });
        });
      });
    }
  };

  return HomeSocket;

})(Socket);

module.exports = HomeSocket;
