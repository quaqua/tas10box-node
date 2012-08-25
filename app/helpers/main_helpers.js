module.exports = function( app ){

	app.locals.tas10box = app.get('tas10box');
	app.locals.siteTitle = app.get('tas10box').site.title;
	
	app.use( function( req, res, next ){

		res.locals._csrf = req.session._csrf;
		res.locals._browser = req.headers['user-agent'].toLowerCase();
		//res.locals.tas10box = app.get('tas10box');

		next();

	});

}
