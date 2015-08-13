#Run code

```sh
$ npm i
$ node app
```

#BackEnd

### Base configuration and connect to mongo to MongoDB

First, we need to specify the connection in the configuration file: index.js.
```sh
$ cd application/config
```
For Example, we next is used for connection [`Mongoose`](https://github.com/Automattic/mongoose#connecting-to-mongodb)
```coffeescript
_Config =
	url: "127.0.0.1"
	port: 3000
	mode: "local"
	socket: true
	publicFolder: "public"
	dirViews: "views"
	viewEngine: "ejs"
	dataBase:
		mongo:
			host: "127.0.0.1"
			port: 27017
			user: ""
			password: ""
			table: "siteBilder"
```
### Defining a Model

To work with the models , we need to access the folder
```sh
$ cd application/models
```

Models are defined through the Schema interface
```coffeescript
Model = require("../class/Model")

module.exports = new Model('history',
  name: String
  text: String
)
```

Aside from defining the structure of your documents and the types of data you're storing, a Schema handles the definition of:

* [Validators](http://mongoosejs.com/docs/validation.html) (async and sync)
* [Defaults](http://mongoosejs.com/docs/api.html#schematype_SchemaType-default)
* [Getters](http://mongoosejs.com/docs/api.html#schematype_SchemaType-get)
* [Setters](http://mongoosejs.com/docs/api.html#schematype_SchemaType-set)
* [Indexes](http://mongoosejs.com/docs/guide.html#indexes)
* [Middleware](http://mongoosejs.com/docs/middleware.html)
* [Methods](http://mongoosejs.com/docs/guide.html#methods) definition
* [Statics](http://mongoosejs.com/docs/guide.html#statics) definition
* [Plugins](http://mongoosejs.com/docs/plugins.html)
* [pseudo-JOINs](http://mongoosejs.com/docs/populate.html)

### Compiling a View

To work with the views , we need to access the folder
```sh
$ cd application/views
```

Each views inlet has: response and name template, and must also have three main parameters
```coffeescript
path = require 'path'
filename = path.parse __filename

module.exports = (response, template) ->
  @name = filename.name
  @response = response
  @template = @name + "/" + template
  return
```

And the method of rendering the page
```coffeescript
module.exports.prototype =
  render: (data) ->
    if @response and @template
      @response.render @template, data
    return
```

### Overview a Controllers

To work with the models , we need to access the folder
```sh
$ cd application/controllers
```

Controllers are comprised of a collection of methods called actions. Action methods can be bound to routes in your application so that when a client requests the route, the bound method is executed to perform some business logic and (in most cases) generate a response.
```coffeescript
View = require("../views/Home")
HomeModel = require("../models/Home")
HomeSocket = require("../socket/HomeSocket")

class HomeController
  run: (req, res)->
    v = new View(res, 'index')

    new HomeSocket()

    HomeModel.find().exec (err, home)->
      v.render(
        title: "Hello World!"
      )
    return

module.exports = HomeController
```

### Overview a Socket

To work with the models , we need to access the folder
```sh
$ cd application/controllers
```

```coffeescript
Socket = require("../class/Socket")

class HomeSocket extends Socket
  init: ()->
    if @isConnected()
      socketIo.emit 'news', hello: 'world'      
      return

module.exports = HomeSocket

```

### Custom Routes

To work with the routes, we need to access the folder and open index.js
```sh
$ cd application/controllers
```
We allow you design your app's URLs in any way you like- there are no framework restrictions.

```coffeescript
routes =
	home:
		type: 'get'
		link: '/'
		control: (req, res) ->
			HomeController::run(req, res)
			return

	about:
		type: 'post'
		link: '/about'
		control: (req, res) ->
			console.log 'Page about'
			return
```