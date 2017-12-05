var PORT = 23333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    //回发确认
    var buf = new Buffer('服务器：我已收到');
    server.send(buf,0,buf.length,remote.port,remote.address);

});

server.bind(PORT, HOST);