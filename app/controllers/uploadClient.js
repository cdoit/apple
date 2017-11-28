var PORT = 33345;
var HOST = '192.168.31.108';

var dgram = require('dgram');
// var message = new Buffer('send start#安装软件.txt#616');
var message = new Buffer('nimei a ');

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close();
});