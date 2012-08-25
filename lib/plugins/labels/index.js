module.exports = function labelsPlugin( app ){

	var routes = require( __dirname + '/routes' );
	routes( app );

}