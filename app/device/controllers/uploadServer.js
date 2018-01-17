var express = require('express');
var login = require('./login');
var router = express.Router();
var iconv = require("iconv-lite");
var uuid = require('node-uuid');
var fs = require('fs');
const db = require("../../db/");
db.init();


var PORT = 33345;
var HOST = '192.168.31.108';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    // console.log(remote.address + ':' + remote.port +' - ' + message);
    var html = iconv.decode(new Buffer(message), 'utf-8');
    console.log(remote.address + ':' + remote.port +' - ' + html);
    //获取数据源
    var data = html.toString();
    var strs= new Array();
    strs = data.split("#");
    console.log(strs);
    //内容
    var txt = "";
    //文件保存路径
    var path = '../../public/upload/';
    //创建文件
    // if(strs[0] == "send start"){
    if(data.indexOf("send start") != -1){
        var pathName = strs[1];
        fs.writeFile(path+pathName,txt,function (err) {
            if (err) throw err ;
            console.log("File Saved !"); //文件被保存
        }) ;
    }else if(data.indexOf("send start") == -1 && data.indexOf("send over") == -1){
        // 测试用的中文  
    // var str = "\r\n我是一个人Hello myself!";  
    // // 把中文转换成字节数组
    // var arr = iconv.encode(data, 'gbk');  
    // console.log(arr);  
      
    // // appendFile，如果文件不存在，会自动创建新文件  
    // // 如果用writeFile，那么会删除旧文件，直接写新文件  
    // fs.appendFile(file, arr, function(err){  
    //     if(err)  
    //         console.log("fail " + err);  
    //     else  
    //         console.log("写入文件ok");  
    // });  
        console.log(data);
    }



});

server.bind(PORT, HOST);