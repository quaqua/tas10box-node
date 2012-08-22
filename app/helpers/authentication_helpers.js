module.exports = function( app ){

	app.use( function( req, res, next ){

		res.locals.isAuthenticated = false;
		res.locals.currentUser = {};

		next();
		
	});

}
