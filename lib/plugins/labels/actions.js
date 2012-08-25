var Label = require( __dirname + '/model' )
  , Document = require('tas10core').getDocument();

/**
 * create a new label
 *
 *  * res.locals.curentUser must be set
 *  * req.body.label is expected to be present
 *
 */
module.exports.createLabel = function createLabel(req, res, next){ 
	
	Label.create( res.locals.currentUser, req.body.label, function( err, label ){
		if( err )
			req.flash('error', req.i18n.t('creation_failed', {name: req.body.label.name, reason: err.message }) );
		else
			res.locals.doc = label.toJSON();
		next();
	} );

};

/**
 * get labels
 *
 *  * res.locals.currentUser must be set
 *  * req.query.roots {Boolean} if only roots should be fetched
 *  * req.query.term {String} a query to be appended to the default query
 *  * req.query.template {String} only lookup documents where template={String}
 *  * req.query.any {Boolean} lookup any document (not only labelable documents)
 *
 */
module.exports.getLabels = function getLabels( req, res, next ){

	var q = Document.query( res.locals.currentUser )
	  , isForComboboxReq = false;

	if( req.query.roots && req.query.roots === 'true' )
		q.where('label_ids', []);

	if( 'term' in req.query && req.query.term.length > 0 ){
		isForComboboxReq = true;
		var re = new RegExp(req.query.term,"i");
		q.where('name', re);
	}

	if( 'template' in req.query && req.query.template.length > 0 ){
		var re = new RegExp(req.query.template,"i");
		q.where( 'template', re );
	}
	
	if( !('any' in req.query) )
		q.where('labelable', true);
	if( !('any' in req.query) && !('term' in req.query) )
		q.where('className','Label');
	q.find( function( err, labels ){
		res.locals.docs = [];
		if( isForComboboxReq ){
			for( var i in labels )
				res.locals.docs.push( { id: labels[i]._id, label: labels[i].name, name: labels[i].name } );
		} else {
			for ( var i in labels )
				res.locals.docs.push( labels[i].toJSON() );
		}
		next();
	});
}