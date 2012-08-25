var auth = require( __dirname + '/../../../app/actions/auth' )
  , tas10router = require(__dirname+'/../../utils/router')
  , tas10Views = require( __dirname+'/../../utils/views')
  , documentActions = require( __dirname+'/../../../app/actions/documents')
  , labelActions = require( __dirname + '/actions' );

module.exports = function labelsRoutes( app ){
	
	app.post('/labels', auth.check, labelActions.createLabel, tas10router.renderCreated);

	app.get('/labels', auth.check, labelActions.getLabels, function( req, res ){
		res.json( res.locals.docs );
	})

	app.get('/labels/:id', auth.check, documentActions.getDocument, tas10router.render);

}