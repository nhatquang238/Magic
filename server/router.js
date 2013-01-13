module.exports = function(app, responder, api){

	app.get('/', function(req,res){
		res.render('home', {title:"MTG"})
	})

	app.post(/^\/card\/(\d+)(?:\/(\w+))?\/?$/, responder(api.fetch_card));

	app.post('/card/:name', responder(api.fetch_card));

	app.post(/^\/language\/(\d+)(?:\/(\w+))?\/?$/, responder(api.fetch_language));

	app.post('/language/:name', responder(api.fetch_language));

	app.post('/set/:name/:page?', responder(api.fetch_set));

	app.post('/sets', responder(api.sets));

	app.post('/formats', responder(api.formats));

	app.post('/types', responder(api.types));

}