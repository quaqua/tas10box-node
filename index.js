
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');


var app;

/**
 * cresys.configure( options )
 * 
 * ### optional configuration options:
 *
 * #### title
 * the title of this application instance to be 
 * shown in the html head title tag.
 */
module.exports.configure = function( options ){

  var parentPath = path.dirname(module.parent.filename);

  app = express();

  app.configure(function(){
    app.set('port', process.env.PORT || options.port || 4444 );
    app.set('views', parentPath + '/app/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger( options.logLevel || 'dev' ));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('twk/cresys/cresys'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  app.get('/routes', function( req, res ){ res.json( app.routes ) });
}

/**
 * cresys.start()
 * 
 * start the cresys application server instance
 */
module.exports.start = function(){
  http.createServer(app).listen(app.get('port'), function(){
    console.log("CRESYS/v listening on port " + app.get('port'));
  });
}