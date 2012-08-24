var fs = require('fs');

function DataStore( options ){
	
	this.path = options.path;

	this.get = function get( filename ){
		var fullFilename = this.path + filename;
		if( fs.existsSync( fullFilename ) )
			return fullFilename;
	}

	
}

module.exports = DataStore;