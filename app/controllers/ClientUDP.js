var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = new Buffer('设备MAC地址#设备当前状态#2017-11-09 11:06:41#2017-11-09 11:06:41#2323#2323#2323#喷墨耗材用量#设备当前项目#设备当前运行速度#23度#设备当前油压#1,2,3#设备错误日志情况');

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close();
});