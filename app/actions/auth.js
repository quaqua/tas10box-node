var tas10core = require( 'tas10core' )
  , User = tas10core.getUser();

module.exports.checkAuthenticated = function checkAuthenticated(req, res, next){

	if( 'authenticationPass' in req )
		next();
	else {
		if( req.session.user_id ) {
			User.query().byId(req.session.user_id).first( function(err, user){
				if( user instanceof User ){
					user.last_request_at = new Date();
					if( user.lastLogin.length > 3 )
						user.lastLogin.splice(0,1);
					user.lastLogin.push({at: new Date(), ip: req.connection.remoteAddress});
					user.save( function( err, user ){
						if( user instanceof User ){
							res.locals.currentUser = user;
							req.authenticationPass = true;
						}
						next();
					});
				} else
					req.xhr ? res.send('location = \'/login\';') : res.redirect('/login');
			});
		} else 
			req.xhr ? res.send('location = \'/login\';') : res.redirect('/login');
	}

};

module.exports.isAuthenticated = function isAuthenticated( req, res, next ){

	if( 'authenticationPass' in req )
		next();
	else {
		if( req.session.user_id ) {
			User.query().byId(req.session.user_id).first( function(err, user){
				if( user instanceof User ){
					user.last_request_at = new Date();
					if( user.lastLogin.length > 3 )
						user.lastLogin.splice(0,1);
					user.lastLogin.push({at: new Date(), ip: req.connection.remoteAddress});
					user.save( function( err, user ){
						if( user instanceof User ){
							res.locals.currentUser = user;
							req.authenticationPass = true;
						}
						next();
					});
				} else
					next();
			});
		} else 
			next();
	}

}