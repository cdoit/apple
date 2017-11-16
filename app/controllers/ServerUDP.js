var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");
db.init();


var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    //解析数据
    var equipmentData= new Array(); //定义一数组 
    equipmentData = message.toString().split("#"); //字符分割
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

    var equipment = {
        id:uuid.v1(),
        code:mac,
        state:state,
        firststartdate:firststartdate,
        startdate:startdate,
        worktimes:worktimes,
        output:output,
        cuttingtimes:cuttingtimes,
        project:project,
        latitude:latitude,
        longitude:longitude,
        elevation:elevation
    };

    db.Equipment.create(equipment).then(function (result) {
        var paramenter = {
            id:uuid.v1(),
            equipmentId:result.id,
            temperature:temperature,
            supplies:supplies,
            speed:speed,
            oilpressure:oilpressure
        };
        db.Equipmentparameter.create(paramenter).then(function (result1) {
            console.log(result1);
        });
    });
});

server.bind(PORT, HOST);