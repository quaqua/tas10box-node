var events = require('events')
  , eventEmitter = new events.EventEmitter();

module.exports.run = function(){
	
	var curFn = 0
	  , args = arguments;

	eventEmitter.on('nextRunSync', function(){
		curFn < args.length && args[curFn++]( next );
	});

	next();

}

function next(){
	eventEmitter.emit('nextRunSync');
}