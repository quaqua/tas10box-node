var auth = require( __dirname + '/../actions/auth' )
  , documentActions = require( __dirname + '/../actions/documents' )
  , tas10router = require(__dirname+'/../../lib/utils/router');

module.exports = function documentsRouter( app ){

	app.get('/documents/new', auth.check, function(req, res){
		res.locals.query = req.body.query;
		res.locals.label_id = req.query.label_id;
		tas10router.render( req, res );
	});

}