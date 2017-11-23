var express = require('express');
var login = require('./login');
var router = express.Router();
var iconv = require("iconv-lite");
var uuid = require('node-uuid');
const db = require("../db/");
db.init();


var PORT = 33334;
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
    //解析数据
    var equipmentData= new Array(); //定义一数组 
    equipmentData = html.toString().split("#"); //字符分割
    // console.log(equipmentData);
    ///////////////////////////////////////////////////////////////
    var mac = equipmentData[0];
    var state = equipmentData[1];
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
    var latitude = array[0];
    var longitude = array[1];
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
                    console.log(result2);
                    // res.json(result2);
                });
            });
        });



        // res.json(result1);
    });

});

server.bind(PORT, HOST);