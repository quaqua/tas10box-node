
var auth = require( __dirname + '/../actions/auth' )
  , tas10core = require('tas10core')
  , path = require('path')
  , User = tas10core.getUser()
  , dataStore = require( __dirname + '/../../lib/app' ).getDataStore();

module.exports = function(app){

	app.get('/user/:id/picture/:resolution', auth.check, function( req, res ){
		if( !req.params.resolution in ['32','50','100'])
			req.params.resolution = '50';

		var picName = '/users/'+req.params.id+'/'+req.params.resolution+'.jpg';

		var pic = dataStore.get(picName);
		if( pic )
			res.sendfile(pic);
		else
			res.sendfile( path.normalize( __dirname + '/../../public/images/nopic_'+req.params.resolution+'x'+req.params.resolution+'.png' ) );
	});
        
}

/*
var db = require('tas10core').db
  ,	auth = require(__dirname + '/../middleware/auth')
  , url = require( 'url' )
  , User = db().User
  , tbViewsPath = require('../../env').tbViewsPath
  , tbEnv = require('../../env').tbEnv
  , tbMail = require( __dirname + '/../middleware/mailer' )
  , Query = db().Query
  , streambuffer = require( __dirname + '/../middleware/streambuffer')
  , imageProcessor = require( __dirname + '/../../plugins/uploadify/image-processor' )
  , path = require('path')
  , fs = require('fs')
  , tbViewDefaults = require('../../env').tbViewDefaults
  , ObjectId = require('mongodb').BSONPure.ObjectID;;

var _tryLoginUser = function _tryLoginUser(req, res, next){

	if( req.body.user && req.body.user.name && req.body.user.password ){

		var cryptPass = User.encryptPassword(req.body.user.password);

		User.query().or( new Query().where('name',req.body.user.name), new Query().where('email', req.body.user.name) )
			.and('hashedPassword',cryptPass).first( function(err, user){
			if( user instanceof User ){
				req.session.user_id = user._id;
				req.loginSuccess = true;
				req.flash('notice', 'success');
				console.log(user.name + ' with id: ' + user._id + ' logged in successfully')
			} else
				req.flash('error', req.i18n.t('login.invalid'));
			next();
		});
	} else {
		req.flash('error', req.i18n.t('login.invalid'));
		next();
	}

};

function _getUser(req, res, next){
	User.query().byId(req.params.id).first( function( err, user ){
		if( user )
			user.getChanges( function( err, user ){
				req.user = user;
				next();
			});
		else
			next();
	});
}

function _getCollaborators( req, res, next ){
	req.friends = [];
		
	if( req.user ){
		var keys =[]; for( c in req.user.friends ){ keys.push( new ObjectId(req.user.friends[c]) ); }
		if( keys.length > 0 ){

			var urlQ = url.parse(req.url, true).query
			  , q = User.query();

			if( 'term' in urlQ && urlQ.term.length > 0 ){
				var re = new RegExp(urlQ.term,"i");
				q.where('name', re)
			}

			q.where('_id').in(keys).find( function( err, users ){
				req.friends = [];
				if( 'term' in urlQ ){
					for( var i in users )
						req.friends.push( {id: users[i]._id, label: users[i].getName(), value: users[i].getName() } );
				} else {
					for( var i in users )
						req.friends.push( users[i].getJSON() );
				}
				next();
			});
		} else
			next();
	}
}

function _updateUser( req, res, next ){
	var oldName = req.user.name;
	var oldPass = req.user.hashedPassword;
	req.user.update(req.body.user, function( err, user ){
		if( user ){
			if( user.name !== oldName )
				req.flash( 'info', req.i18n.t('renamed', {from: oldName, to: user.name}));
			else if( user.hashedPassword !== oldPass )
				req.flash( 'info', req.i18n.t('password_changed'));
			else
				req.flash( 'info', req.i18n.t('settings_saved', {name: user.name } ));
			req.user = user;
		} else
			req.flash( 'error', req.i18n.t('saving_failed', {name: req.user.name} ) );
		next();
	})
}

function _updateUserDefaults( req, res, next ){
	var info;
	if( req.body.action === 'push' ){
		if( !( req.body.key in req.user.defaults ) )
			req.user.defaults[req.body.key] = [];
		if( !( req.body.value in req.user.defaults[req.body.key] ) )
			req.user.defaults[req.body.key].push(req.body.value);
		info = req.i18n.t('user.default_set', {key: req.body.key, value: req.body.value});
	} else if( req.body.action === 'pull' ){
		if( req.body.key in req.user.defaults ){
			if( req.user.defaults[req.body.key].indexOf(req.body.value) >= 0 )
				req.user.defaults[req.body.key].splice( req.user.defaults[req.body.key].indexOf(req.body.value), 1 );
			info = req.i18n.t('user.default_removed', {key: req.body.key, value: req.body.value});
		}
	}
	req.user.save( function( err, user ){
		if( user ){
			req.flash( 'info', info );
			req.user = user;
		} else
			req.flash( 'error', req.i18n.t('saving_failed', {name: req.user.name} ) );
		next();
	})
}

function _getUserByEmail( req, res, next ){
	if( 'email' in req.body ){
		User.query().where('email', req.body.email).first( function( err, user ){
			req.invitedUser = null;
			if( user )
				req.invitedUser = user.getJSON();
			next();
		})
	}
}

function _checkConfirmationKey( req, res, next ){

	if( req.user.confirmationKey !== req.params.confirmationKey )
		req.user = null;

	next();

}

function _inviteEmailAddr( req, res, next ){
	if( !req.invitedUser && req.currentUser && 'email' in req.body ){
		User.create(req.currentUser, { name: req.body.email, email: req.body.email, confirmation_key: require('sha1')(new Date().toString()) }, 
			function( err, user ){
				if( user ){
					req.invitedUser = user.getJSON();
					if( !(req.invitedUser._id in req.currentUser.friends) )
						req.currentUser.friends.push( req.invitedUser._id.toString() )
					req.currentUser.save( function(err, user){
						if( user )
							req.currentUser = user;

						if( 'skipMail' in req.body ){
					  		req.flash('info', req.i18n.t('user.invited_no_email', {name: req.invitedUser.email}));
					  		next();
						} else {

							var addr = 'http://' + tbEnv.domainName + '/user/'+req.invitedUser._id+'/setup/'+req.invitedUser.confirmationKey;

							tbMail.send( {to: req.invitedUser.email, 
										  from: user.getName() + ' <' + user.email + '>',
										  subject: '['+tbEnv.title+'] ' + user.getName() + ' invites you to collaborate',
										  html: '<h3>Hi, ' + req.invitedUser.name + '</h3>' +
										  		'<p>' + user.getName() + ' invites you to collaborate on ' + tbEnv.title +
										  		'</p>' +
										  		'<p>To follow this invitation, just click the link below:</p>' +
										  		'<p><a href="'+addr+'">'+addr+'</a></p>' +
										  		'<p>Sincerly,<br />&nbsp;&nbsp;tas10box automailer</p>'
										  }, function( err, mailResponse ){
										  	if( err === null )
										  		req.flash('info', req.i18n.t('user.invited', {name: req.invitedUser.email}));
											next();
										  })
						}
					});
				} else
					next();
			}
		);
	} else
		next();
}

var _uploadPicture = function(req, res, next){ 

	var PAUSE_TIME = 5000,
	    MAX_SIZE = 5*1024*1024, // 5MB
	    EXTENSIONS = ['png', 'jpeg', 'jpg']; // jpegs and pngs only
    

	var name = req.headers['x-file-name']
	  , extension = path.extname(name).toLowerCase();

    if (!name) {
        res.send(JSON.stringify({error: "No name specified."}));
        return;
    }

    var size = parseInt(req.headers['content-length'], 10);
    if (!size || size < 0) {
        res.send(JSON.stringify({error: "No size specified."}));
        return;
    }

    if (size > MAX_SIZE) {
        res.send(JSON.stringify({error: "Too big. (" + MAX_SIZE + "MB)"}));
        return;
    }

    if( !req.user ){
    	res.send(JSON.stringify({error: "Error creating file"}));
    	return;
    }

    // files go in media/#number#/image.png
    // thumbnails in media/#number#/#sizename#/image.png
    var dirPath = global.appDir + '/data/users/'+req.user._id+'/';

	if( !path.existsSync( global.appDir + '/data/users' ) )
		fs.mkdirSync(global.appDir+'/data/users', 0755);
	if( !path.existsSync( dirPath ) )
    	fs.mkdirSync(dirPath, 0755);

    var filePath = global.appDir+'/data/users/'+req.user._id+'/'+req.user.name+extension;
    var bytesUploaded = 0;
    var file = fs.createWriteStream(filePath, {
        flags: 'w',
        encoding: 'binary',
        mode: 0644
    });

    req.streambuffer.ondata( function( chunk ) {
        if (bytesUploaded+chunk.length > MAX_SIZE) {
            file.end();
            res.send(JSON.stringify({error: "Too big."}));
            // TODO: remove the partial file.
            return;
        }
        file.write(chunk);
        bytesUploaded += chunk.length;

        // TODO: measure elapsed time to help ward off attacks?

        // deliberately take our time
        req.pause();
        setTimeout(function() {req.resume();}, PAUSE_TIME);
    });

    req.streambuffer.onend( function() {
        file.end(); 
        imageProcessor.crop( req.user, ['32','50','100'], global.appDir+'/data/users/', req.user.name+extension, function(err, data) {
	        if( err ) {
	            // bit of a hack sending the error straight to the client
	            res.send(JSON.stringify({error: err}));
	            // TODO: remove the file.
	            return;
	        }
			next();
        } );
    });

};

function _updateUserCollaborators( req, res, next ){
	if( req.currentUser && req.invitedUser ){
		if( req.currentUser.friends.indexOf(req.invitedUser._id.toString()) < 0 )
			req.currentUser.friends.push(req.invitedUser._id.toString());

		req.currentUser.save( function( err, user ){
			if( user ){
				req.currentUser = user;
				req.success = true;
			}
			next();
		})
	} else
		next();
}
*/

/*
	app.get('/login', function(req, res){
	  res.render(tbViewsPath + '/users/login.html.ejs', tbViewDefaults);
	});

	app.post('/login', _tryLoginUser, function(req, res){
		if( req.loginSuccess )
			res.redirect('/dashboard');
		else{
			res.render(tbViewsPath + '/users/login.html.ejs', tbViewDefaults);
		}
	});

	app.get('/user/:id/collaborators', checkAuthenticated, _getUser, _getCollaborators, function( req, res ){
		res.json( req.friends );
	});

	app.get('/user/:id', checkAuthenticated, _getUser, function( req, res ){
		res.render(tbViewsPath + '/users/show.js.ejs', {user: req.user, layout: false});
	});

	app.get('/user/:id/edit', checkAuthenticated, _getUser, function( req, res ){
		res.render(tbViewsPath + '/users/edit.js.ejs', {user: req.user, layout: false});
	});

	app.put('/user/:id/defaults', checkAuthenticated, _getUser, _updateUserDefaults, function( req, res ){
		res.render(tbViewsPath + '/users/update.js.ejs', {user: req.user, close_tab: false, layout: false});
	});

	app.put('/user/:id', checkAuthenticated, _getUser, _updateUser, function( req, res ){
		res.render(tbViewsPath + '/users/update.js.ejs', {user: req.user, close_tab: req.body.close_tab, layout: false});
	});

	app.post('/user/:id/picture', streambuffer, checkAuthenticated, _getUser, _uploadPicture, function( req, res ){
		res.send(JSON.stringify({success: true, user: req.user}));
	});

	app.post('/users/invite', checkAuthenticated, _getUserByEmail, _inviteEmailAddr, _updateUserCollaborators, function( req, res ){
		res.json( { ok: req.success, user: req.invitedUser } );
	});

	app.get('/user/:id/setup/:confirmationKey', _getUser, _checkConfirmationKey, function( req, res ){
		tbViewDefaults['user'] = req.user
		if( req.user.confirmationKey === req.params.confirmationKey )
			res.render(tbViewsPath + '/users/setup.html.ejs', tbViewDefaults);
		else
			res.send('registration key missmatch');
	});

	app.post('/user/:id/setup/:confirmationKey', _getUser, _checkConfirmationKey, _updateUser, function( req, res ){

		tbViewDefaults['user'] = req.user

		if( req.flash('info').length > 0 )
			res.redirect('/login');
		else
			res.render(tbViewsPath + '/users/setup.html.ejs', tbViewDefaults);
	});

	app.get( '/logout', function( req, res ){
		req.session.user_id = null;
		res.redirect('/login');
	});

	app.get('/users/pause', function( req, res ){
		setTimeout(function(){ res.send('done'); }, 3000 );
	})

	app.get('/users/setup', function( req, res ){

		User.query().where('name', 'manager').first( function(err, user){
				if( !user )
					User.create({name: 'manager', password: 'mgr'}, function(err, user){
						res.send('successfully created manager with mgr');
					});
				else
					res.send('already exists. nothing done.');
			});

	});
*/