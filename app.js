
/**
 * Module dependencies.
 */

var config = require('config')
  , express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

var bootstrap = require('bootstrap-stylus')
  , stylus = require('stylus');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(bootstrap());
}

app.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile
}));

// Routes

app.get('/', routes.index);

var twitter = require('ntwitter');

var twit = new twitter(config.twitter);

twit.stream('statuses/filter', {'locations':'-79.6393, 43.5849, -79.1156, 43.8554'}, function(stream) {
  stream.on('data', function (data) {
    io.sockets.emit('tweet', data);
  });
});

io.sockets.on('connection', function(socket) {
  console.log('socket connected...');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
