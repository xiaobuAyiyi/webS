var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 8181 });
wss.on('connection', function (ws) {
  console.log('client connected');
  ws.on('message', function (message) {
    console.log(message);
  });
  setTimeout(function() {
    ws.send('我是服务器');
}, 1000);
});