var fs = require('fs')
  , path = require('path')
  , util = require('util');

var _views = [];

module.exports = {
    
    get: function tas10GetViews( name ){
        console.log('lookup: ', name);
        var vname = null;
        _views.forEach( function iterate_Views( v ){
            var vn = v + '/' + name;
            if( fs.existsSync( vn ) )
                return(vname = vn);
        })
        return vname;
    },

    list: function tas10ListViews(){
        return util.inspect(_views);
    },

    set: function tas10SetView( name ){
        name = path.normalize(name);
        if( _views.indexOf( name ) < 0 )
            _views.push( name );
    }
    
}