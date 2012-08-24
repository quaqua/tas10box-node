module.exports = function( app ){

    app.use( function( req, res, next ){
        
        res.locals.dynamicPartial = function( name, options ){
            
            var jade = require('jade')
              , tas10Views = require( __dirname + '/../../lib/utils/views' )
              , fs = require('fs')
              , filename = tas10Views.get( name )
              , j;
            
            if( !options )
                options = {};
            for( var i in res.locals ){
                options.locals || (options.locals = {});
                options.locals[i] = res.locals[i];
            }
            for( var i in app.locals )
                options.locals[i] = app.locals[i];
            
            if( !options.locals )
                options.locals = res.locals;

            options.locals.tas10box = app.get('tas10box');

            j = jade.compile( fs.readFileSync(filename), { filename: filename } )( options.locals );
            return j;
            
        }
        
        next();
        
    });

}
