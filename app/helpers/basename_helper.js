module.exports = function basenameHelperContainer( app ){

    app.locals.basename = function basenameHelper( name, noExtension ){
        var path = require('path')
        if( typeof(noExtension) !== 'undefined' )
            return path.basename( name ).split('.')[0];
        return path.basename( name );
    }

}
