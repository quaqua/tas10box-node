var tas10core = require( 'tas10core' )
  , User = tas10core.getUser()
  , Query = tas10core.getQuery();

module.exports.loginUser = function loginUser(req, res, next){

	if( req.body.user && req.body.user.name_or_email && req.body.user.password ){

		var cryptPass = User.encryptPassword(req.body.user.password);

		User.query().or( new Query().where('name',req.body.user.name_or_email), new Query().where('email', req.body.user.name_or_email) )
			.and('hashedPassword',cryptPass).first( function(err, user){
			if( user instanceof User ){
				req.session.user_id = user._id;
				req.loginSuccess = true;
				req.flash('info', req.i18n.t('login.successfull') );
				console.log(user.name + ' with id: ' + user._id + ' logged in successfully')
			} else
				req.flash('error', req.i18n.t('login.invalid'));
			next();
		});
	} else {
		req.flash('error', req.i18n.t('login.invalid') );
		next();
	}

};