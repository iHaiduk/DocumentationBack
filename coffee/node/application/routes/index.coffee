routes =
	home:
		type: 'get'
		link: '/'
		control: (req, res) ->
			HomeController::run(req, res)
			return

	save:
		type: 'post'
		link: '/save'
		control: (req, res) ->
			HomeController::save(req, res)
			return

module.exports = class Routes
	init: (app)->
		for i of routes
			page = routes[i]
			console.log page
			app[page.type] page.link, page.control
		return