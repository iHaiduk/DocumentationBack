_Config =
	url: "127.0.0.1"
	port: 3001
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


module.exports = _Config