function _flash( status, msg ){

	if( status === 'error' && msg && msg !== 'sweep' )
		this.session.error = msg;

	if( msg && msg !== 'sweep' )
		this.session.flash[status].push( msg );
	else
		if( msg && msg === 'sweep' )
			return this.session.flash[status].pop();
		else
			return this.session.flash[status][this.session.flash[status].length-1];

}

module.exports = function( app ){

	app.use( function( req, res, next ){

		req.session.flash || (req.session.flash = { error: [], info: [] });

		req.flash = _flash

		res.locals.flash = function flashLocal( status, msg ){ return _flash.call( req, status, msg ); }

		next();
		
	});

}
