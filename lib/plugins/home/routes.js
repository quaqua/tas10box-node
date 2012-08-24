var tas10router = require(__dirname+'/../../utils/router')
  , tas10Views = require( __dirname+'/../../utils/views');


module.exports = function homeRoutes( app ){
	
        tas10Views.set( __dirname + '/views' );
        
	app.get( '/home', function( req, res ){

		res.format({
			html: function(){
                            tas10router.render( req, res );
			},
			js: function(){
                            tas10router.render( req, res );
			}
		})

	});

}