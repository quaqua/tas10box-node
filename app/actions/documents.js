var tas10core = require( 'tas10core' )
  , Document = tas10core.getDocument()
  , Query = tas10core.getQuery();

/**
 *
 * get document by param :id
 */
module.exports.getDocument = function getDocument( req, res, next ){
	Document.query( res.locals.currentUser ).byId(req.params.id).first( function( err, doc ){
		if( err )
			req.flash('error', req.i18n.t('not_found') );
		if( doc )
			res.locals.doc = doc;
		next();
	});
}