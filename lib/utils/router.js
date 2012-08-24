// # Router functions
// functions to be passed to a router file.

var fs = require('fs')
  , path = require('path');
  
var tas10Views = require( __dirname + '/views' );

// # render
// render the current route by trying to guess the name
// of the according view and format.
//
module.exports.render = function( req, res ){    
    
    var lookup = req.route.path.replace(/\//,'')
      , extension = '.' + req.accepted[0].subtype
      , viewFileName = lookup + extension + '.jade';
    
    if( lookup === '' )
        viewFileName = '/index.html.jade';
        
    var viewPath = tas10Views.get( viewFileName )
      , defaults = { layout: false };

    res.render( viewPath, defaults )

}
