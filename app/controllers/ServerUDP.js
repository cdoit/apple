// var express = require('express');
// var login = require('./login');
// var router = express.Router();
var iconv = require("iconv-lite");
var uuid = require('node-uuid');
const db = require("../db/");
db.init();


var PORT = 3000;
var HOST = '192.168.31.108';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    var html = iconv.decode(new Buffer(message), 'utf-8');
    console.log(remote.address + ':' + remote.port +' - ' + html);
    //判断是否是验证账号密码
    var data = html.toString();
    if(data.indexOf("valid") != -1){
        var account = html.toString().split("#");
        var mac = account[1];
        var loginName = account[2];
        var passwords = account[3];
        var filter = {
            code:mac
        }
        db.Equipment.findOne(filter).then(function (result){
            //判断mac是否存在
            if(result!=null){
                db.AdminInfo.findOne(
                {
                    adminname:loginName,
                    password:passwords
                }
            ).then(function (result2){
                    //判断账号密码是否正确
                    var buf = new Buffer("true");
                    if(result2 == null){
                        var buf = new Buffer("false");
                    }
                    server.send(buf,0,buf.length,remote.port,remote.address);
                    console.log(buf);
                });
            }
        });
    }else if(data.indexOf("online") != -1){
        var buf = new Buffer("online is ok");
        server.send(buf,0,buf.length,remote.port,remote.address);
        console.log(buf);
    }else{
        //解析数据
    var equipmentData= new Array(); //定义一数组 
    equipmentData = html.toString().split("#"); //字符分割
    // console.log(equipmentData);
    ///////////////////////////////////////////////////////////////
    var mac = equipmentData[0];
    //  默认的设备状态是1
    var state = "2";
    var workstate = equipmentData[1];
    var firststartdate = equipmentData[2];
    var startdate = equipmentData[3];
    var worktimes = equipmentData[4];
    var output = equipmentData[5];
    var cuttingtimes = equipmentData[6];
    var project = equipmentData[8];
    //位置
    var location = equipmentData[12];
    //解析位置
    var array = new Array();
    array = location.toString().split(",");
    // 暂无
    var latitude = array[1];
    var longitude = array[0];
    var elevation = array[2];
    // 暂无
    var temperature = equipmentData[10];
    var supplies = equipmentData[7];
    var speed = equipmentData[9];
    var oilpressure = equipmentData[11];
    //判断mac是否存在
    var filter = {
        code: mac
    }
    // var users = db.Equipment.findAll(filter);
    
    //第一步：判断是否设备存在
    db.Equipment.findOne(filter).then(function (result1) {
        console.log(result1.length);
        //如果存在
        var equipment;
        if(result1!=null){
            equipment = {
                id:result1.id,
                code:mac,
                state:state,
                workstate:workstate,
                firststartdate:firststartdate,
                startdate:startdate,
                worktimes:worktimes,
                output:output,
                cuttingtimes:cuttingtimes,
                project:project
            };
        }else{
            equipment = {
                id:uuid.v1(),
                code:mac,
                state:state,
                workstate:workstate,
                firststartdate:firststartdate,
                startdate:startdate,
                worktimes:worktimes,
                output:output,
                cuttingtimes:cuttingtimes,
                project:project
            };
        }
        //操作数据
        db.Equipment.insertOrUpdate(equipment).then(function (result) {
            var paramenter = {
                id:uuid.v1(),
                equipmentId:equipment.id,
                temperature:temperature,
                supplies:supplies,
                speed:speed,
                workstate:workstate,
                oilpressure:oilpressure
            };
            db.Equipmentparameter.create(paramenter).then(function (result1) {
                //继续往Equipmentposition加值
                var position = {
                    id:uuid.v1(),
                    equipmentId:result1.equipmentId,
                    latitude:latitude,
                    longitude:longitude,
                    elevation:elevation
                };
                db.Equipmentposition.create(position).then(function (result2) {
                    //回发确认
                    var buf = new Buffer('success');
                    server.send(buf,0,buf.length,remote.port,remote.address);
                });
            });
        });
    });
    }

});

server.bind(PORT, HOST);