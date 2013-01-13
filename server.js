var api, app, express, port, responder, _ref, server, io;

express = require('express');

api = require('./gatherer');

responder = function(fn) {
  return function(req, res) {
    return fn.call(req, function(err, data) {
      var callback, text, _ref;
      if ('error' in data || (err != null)) {
        console.log("Response error " + data.error + ", status " + data.status);
        return res.json(data, (_ref = data.status) === 301 || _ref === 302 ? 404 : data.status);
      } else if (callback = req.param('callback')) {
        text = "" + callback + "(" + (JSON.stringify(data)) + ")";
        return res.send(text, {
          'Content-Type': 'text/plain'
        });
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.json(data);
      }
    });
  };
};

app = express();
app.root = __dirname;
server = require('http').createServer(app);
io = require('socket.io').listen(server);

//session support 
  var cookieParser = express.cookieParser('12bbc928m11290x890y312xbtge')
  , sessionStore = new express.session.MemoryStore
  , SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'mosaicto.sid');

require('./server/config')(app, express, sessionStore, cookieParser);
require('./server/router.js')(app, responder, api);

port = (_ref = process.env.PORT) != null ? _ref : 3000;

require('./server/modules/sio')(sessionSockets, io);

server.listen(port, function() {
  return console.log("Listening on " + port);
});
