var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");

//任务（项目）列表
router.get('/list', login.checkin, function (req, res, next) {
        var countPerPage = 10, currentPage = 1;
        db.Project.findAll(
            {
                'limit': countPerPage,                      //每页多少条
                'offset': countPerPage * (currentPage - 1)  //跳过多少条
            }
        ).then(function (result) {
            res.render('project/list.ejs', { project: result });
        });
});



router.get('/add', login.checkin, function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    var filter = {
        where: {
            id:equipmentId
        }
    }
    db.Equipment.findOne(filter).then(function (result) {
        res.render('equipment/add.ejs', { equipment: result });
    }).catch(next);
});

router.post('/addEquipment', login.checkin, function (req, res, next) {
    var admin = req.session.admin;
    var equipmentId = req.body.equipmentId;
    var name = req.body.name;
    var code = req.body.code;
    var priority = req.body.priority;
    var warrantyperiod = req.body.warrantyperiod;
    var customer = req.body.customer;
    var state = req.body.state;
    var workstate = req.body.workstate;
    var buytime = req.body.buytime;

    if(equipmentId == undefined || equipmentId == ''){
        equipmentId = uuid.v1();
    }

    var equipment = {
        id:equipmentId,
        name:name,
        // adminInfoId:admin.id,
        code:code,
        // uploadtime:new Date(),
        state:state,
        priority:priority,
        warrantyperiod:warrantyperiod,
        customer:customer,
        workstate:workstate,
        buytime:buytime
    }

    db.Equipment.insertOrUpdate(equipment).then(function (result) {
        res.redirect("/equipment/list");
    }).catch(next);
        
    });

router.get('/delete', login.checkin, function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    if(equipmentId != undefined || equipmentId != null){
        var filter = {
            where: {
                id:equipmentId
            }
        }
        db.Equipment.destroy(filter).then(function (result) {
            res.json(result);
        }).catch(next);
    }
});


//地图
router.get('/map', login.checkin, function (req, res, next) {
    res.render('equipment/map.ejs');
});


//设备数据接口
router.get('/equipmentData', function (req, res, next) {
    db.Sequelize.query(
        "SELECT ep.*,e.`code`,e.`name`,e.buytime,e.customer from equipmentposition ep JOIN equipment as e on e.id = ep.equipment_id where NOT exists (SELECT 1 FROM equipmentposition where ep.equipment_id = equipment_id and created_at>ep.created_at)"
    ).then(function (result) {
        res.json(result[0]);
    }).catch(next);
});

 
//设备详情数据接口
router.get('/equipmentInfo', function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    db.Sequelize.query(
        "SELECT e.id,e.`name`,e.`code`,f.address,f.factoryname,f.phonenumber from equipment AS e left JOIN factoryversion as f on e.id = f.equipment_id where e.id='"+equipmentId+"'"
    ).then(function (result) {
        res.json(result[0]);
    }).catch(next);
});

module.exports = router;