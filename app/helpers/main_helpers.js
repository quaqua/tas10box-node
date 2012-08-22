module.exports = function( app ){

	app.locals.site = app.get('tas10box').site;

	app.use( function( req, res, next ){

		res.locals._csrf = req.session._csrf;
		res.locals._browser = req.headers['user-agent'].toLowerCase();

		next();

	});

}
