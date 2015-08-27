var app, applicationDirectory, bodyParser, config, express, path, pub, session;

applicationDirectory = __dirname + '/application/';

express = require('express');

bodyParser = require("body-parser");

app = express();

path = require('path');

global["http"] = require('http').Server(app);

config = require(applicationDirectory + 'config');

session = require('express-session');


/* Path to express public directory */

pub = __dirname + '/' + config.publicFolder;

app.set('views', config.dirViews);

app.set('view engine', config.viewEngine);

app.set('trust proxy', 1);

app.use(express['static'](pub));

app.use(bodyParser.json({
  limit: '500mb'
}));

app.use(bodyParser.urlencoded({
  limit: '500mb',
  extended: false
}));

app.use(session({
  secret: 'documentation',
  resave: false,
  saveUninitialized: true
}));


/* Adapter */

require(applicationDirectory + 'adapter')(config);

require(applicationDirectory + 'class/Controller').prototype.init();


/* Socket */

if ((config != null) && config.socket) {
  global["socketIo"] = null;
}


/* Routing */

require(applicationDirectory + 'routes').prototype.init(app);


/* Start server */

http.listen(config.port, function() {
  console.log('Server started. Link: http(s)://' + config.url + ':' + config.port);
});
