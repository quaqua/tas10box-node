// # Application configuration

var express = require('express')
  , engines = require('consolidate')
  , http = require('http')
  , i18next = require('i18next')
  , fs = require('fs')
  , path = require('path')
  , tas10core = require('tas10core');

var sync = require( __dirname+'/utils/synchronous');


var app
  , parentPath = path.dirname( module.parent.filename );

// # configure
// 
// options are:
// 
// ### title {String}
// the title of this applicaiton instance to be
// used in html head title tag.
//
// ### port {String}
// the port this application server should start at
//
// ### plugins {Object}
// an array with indexes of the desired plugin names
// the plugins should have been installed with
// npm install <pluginname> command before.
//
// e.g.:
// 
//      { contact: { templates: ['a','b','default'] }, 
//        webpage: { publish: true } }
//
module.exports.configure = function( options ){

  // connect to the tas10core
  tas10core.connect( options.db );

  i18next.init({
      resGetPath: __dirname + '/../public/locales/__lng__/__ns__.json',
      fallbackLng: 'en',
      saveMissing: true,
      dynamicLoad: true
  });

  app = express();

  app.configure(function(){

    app.set('port', process.env.PORT || options.port || 4444 );
    app.engine('jade', engines.jade);
    app.engine('ejs', engines.ejs);
    app.set('views', parentPath + '/app/views');
    //app.set('view engine', 'ejs');
    app.set('tas10box', options);
    app.use(express.favicon( __dirname + '/../public/favicon.ico' ));
    app.use(express.logger( options.logLevel || 'dev' ));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('http://tastenwerk.com/oss/tas10box'));
    app.use(express.session());
    app.use(express.csrf());

    app.use(require('stylus').middleware(__dirname + '/../public'));
    app.use(express.static(path.join(__dirname, '/../public')));

    app.use(i18next.handle);
    i18next.registerAppHelper( app );

    loadHelpers();
    loadCoreMiddleware();

    app.locals.tas10 = require( __dirname + '/tas10_defaults').tas10();

    // should be last statement !!!
    app.use(app.router);
    
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler()); 

    console.log("TODO: create asset manager for faster js/css https://github.com/mape/connect-assetmanager");

  });


  sync.run( loadCoreRoutes,
            loadCorePlugins,
            loadPlugins, 
            loadAppModels );


}

// # start
// start the tas10box application server
module.exports.start = function(){
  http.createServer(app).listen(app.get('port'), function(){
    console.log("[tas10box] http server listening on port " + app.get('port'));
  });
}

function loadAppModels( next ){

  var collected = requireFromPath( parentPath + '/app/models' );
  console.log('[tas10box] collected models: ', collected);
  next(); 
}

function loadCorePlugins( next ){
  
  var collected = requireFromPath( __dirname + '/plugins' );
  console.log('[tas10box] collected core plugins: ', collected);
  next();

}

function loadCoreRoutes( next ){

  var collected = requireFromPath( __dirname + '/../app/routes' );
  console.log('[tas10box] collected core routes: ', collected);
  next();

}

function loadCoreMiddleware( next ){

  var collected = requireFromPath( __dirname + '/../lib/middleware' );
  console.log('[tas10box] collected core middleware: ', collected);

}

function loadHelpers(){

  var collected = requireFromPath( __dirname + '/../app/helpers' );

}

function requireFromPath( path ){

  var collected = [];

  if( fs.existsSync( path ) ){
    fs.readdirSync( path ).forEach( function( file ){
      collected.push( file );
      require( path + '/' + file.replace('.js',''))( app );
    });
  }

  return collected;

}

/**
 * loads all routes in the /lib/routes dir
 */
function loadPlugins( next ){
  var plugins = app.get('plugins')
    , collected = [];

  if( plugins )
    for( var name in plugins ){
      var plugin = plugins[name];
      collected.push( name );
    }

  console.log('TODO: require plugins', collected);
  next();
}