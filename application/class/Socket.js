var Socket, sockIo;

sockIo = require('socket.io')(http);

Socket = (function() {
  function Socket() {
    var _this;
    _this = this;
    if (typeof socketIo === "undefined" || socketIo === null) {
      global["socketIo"] = "wait";
      sockIo.sockets.on('connection', function(socket) {
        global["socketIo"] = socket;
        _this.init();
      });
    } else {
      _this.init();
    }
  }

  Socket.prototype.isConnected = function() {
    return (typeof socketIo !== "undefined" && socketIo !== null) && socketIo !== "wait";
  };

  Socket.prototype.init = function() {
    return console.log(socketIo);
  };

  return Socket;

})();

module.exports = Socket;
