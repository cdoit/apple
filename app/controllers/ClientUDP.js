var PORT = 3000;
var HOST = '192.168.31.108';

var dgram = require('dgram');
// var message = new Buffer('设备MAC地址#设备当前状态#2017-11-09 11:06:41#2017-11-09 11:06:41#2323#2323#2323#喷墨耗材用量#设备当前项目#设备当前运行速度#23度#设备当前油压#1,2,3#设备错误日志情况');
// var message = new Buffer('680715AFF302#1#2017-11-15 08:08:08#2017-11-16 08:08:08#24#3000#2800#1#丘处机#200#32#1#110.1,28.9,10000#伺服错误代码1100h');
// var message = new Buffer('680715AFF302#3#2017-11-15 08:08:08#2017-11-16 08:08:08#24#3000#2800#1#丘处机22#200#32#1#110.1,28.9,10000#伺服错误代码1100h');
var message = new Buffer('valid#680715AFF302#admin#admin');


var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close();
});