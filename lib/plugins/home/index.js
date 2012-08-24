module.exports = function homedirPlugin( app ){

	var routes = require( __dirname + '/routes' );
	routes( app );

}