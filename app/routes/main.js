// # Main Routes
//
// the main preconfigured routes in html mode
// all other routes will be passed out as 
// either JSON, BSON or JS.

var auth = require( __dirname + '/../actions/auth' )
  , userActions = require( __dirname + '/../actions/users' )
  , tas10router = require(__dirname+'/../../lib/utils/router');

module.exports = function( app ){


	app.get('/', auth.check, tas10router.render);

	app.get('/login', tas10router.render);

	app.post('/login', userActions.loginUser, function(req, res){
            if( req.loginSuccess )
                    res.redirect('/');
            else{
                    tas10router.render( req, res );
            }
	});
    
	app.get( '/logout', function( req, res ){
            req.session.user_id = null;
            res.redirect('/login');
	});

	app.get('/sys/status/locale', function(req, res) {
	    res.send('locale: ' + req.locale + ' (' + req.session.user_id + ') <br /> key welcome -> ' + req.i18n.t('welcome'));
	});


  	app.get('/sys/status/routes', function( req, res ){ res.json( app.routes ) });

};