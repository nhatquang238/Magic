module.exports = function(app, exp, sessionStore, cookieParser){

	app.configure(function(){
		app.set('views', app.root + '/server/views');
		app.use(exp.favicon(app.root + '/public/img/favicon.ico'));
		app.set('view engine', 'jade');
		app.set('view options', { doctype : 'html', pretty : true });
		app.use(exp.bodyParser());
		app.use(cookieParser);
		app.use(exp.session({store:sessionStore, key: 'mtg.sid'}));		
		app.use(exp.methodOverride());
		app.use(require('stylus').middleware({ src: app.root + '/public' }));
		app.use(exp.static(app.root + '/public'));
	});

}