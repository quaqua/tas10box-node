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

    var extension = '.' + req.accepted[0].subtype
    if( extension === '.javascript' )
      extension = '.js'

    var lookup = req.route.path.replace(/\//,'')
      , viewFileName = lookup + extension + '.jade';
    
    if( lookup === '' )
        viewFileName = '/index.html.jade';

    if( lookup.indexOf(':id') > 0 )
        viewFileName = viewFileName.replace(':id', 'show');
        
    var viewPath = tas10Views.get( viewFileName )
      , defaults = { layout: false };

    if( !viewPath )
        throw new Error('view ' + viewFileName + ' not found.\nVIEWS ARE:\n' + tas10Views.list() );

    res.render( viewPath, defaults )

}


/**
 * lookup for a create.js[.ejs] file. If none was found
 * take the default from documents/ directory
 */
module.exports.renderCreated = function( req, res ){

    var extension = '.' + req.accepted[0].subtype
    if( extension === '.javascript' )
    	extension = '.js'
    var lookup = req.route.path.replace(/\//,'')
      , viewFileName = lookup + '/create' + extension + '.ejs'
      , viewPath = tas10Views.get( viewFileName )
      , defaults = {layout: false};
    
    if( !viewPath )
    	viewPath = tas10Views.get( '/documents/create'+extension+'.ejs' );

    if( !viewPath )
        throw new Error('view not found.\nVIEWS ARE:\n' + tas10Views.list() );

    res.render( viewPath, defaults )

}