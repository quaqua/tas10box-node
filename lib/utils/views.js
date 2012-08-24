var fs = require('fs')
  , path = require('path');

var _views = [];

module.exports = {
    
    get: function tas10GetViews( name ){
        var vname;
        _views.forEach( function iterate_Views( v ){
            var vn = v + '/' + name;
            if( fs.existsSync( vn ) )
                return(vname = vn);
        })
        return vname;
    },
    set: function tas10SetView( name ){
        name = path.normalize(name);
        if( _views.indexOf( name ) < 0 )
            _views.push( name );
    }
    
}