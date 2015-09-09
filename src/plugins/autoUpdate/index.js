var Plugins = require('../../controllers/plugins.js');
var udps = require("dgram").createSocket("udp4");
var server = require('http').createServer();
var io = require('socket.io')(server);

var singleUserSocket = false;

Plugins.registerView('plugin_AutoUpdate.js', function(reply, data){
	reply.file('plugins/autoUpdate/autoUpdate.js');
});

udps.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);

  io.emit("MODEL_UPDATE", {data:msg.toString()});

  if(singleUserSocket){
  	singleUserSocket.emit('MODEL_UPDATE', {data:msg});
  }

});

udps.on("listening", function () {
    var address = udps.address();
    console.log("I am listening on " + 
        address.address + ":" + address.port);
});

io.on('connection', function(socket){
  console.log('a user connected');
  var singleUserSocket= socket;
});

udps.bind(12345, '127.0.0.1');
server.listen(3001);