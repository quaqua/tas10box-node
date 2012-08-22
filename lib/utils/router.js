// # Router functions
// functions to be passed to a router file.

var fs = require('fs')
  , path = require('path');

// # render
// render the current route by trying to guess the name
// of the according view and format.
//
module.exports.render = function( req, res ){

	var lookup = req.route.path
	  , viewPath = path.normalize(path.dirname( module.parent.filename ) + '/../views')
	  , viewFileName = viewPath + lookup + '.jade'
	  , defaults = { layout: false };

	if( lookup === '/' )
		viewFileName = viewPath + '/index.jade';

	if( req.override )
		for( var i in req.override )
			res.locals.tas10box[i] = req.override[i];

	res.render( viewFileName, defaults )

}
