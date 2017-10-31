var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");

//设备列表
router.get('/list', login.checkin, function (req, res, next) {
        var countPerPage = 10, currentPage = 1;
        db.Equipment.findAll(
            {
                'limit': countPerPage,                      //每页多少条
                'offset': countPerPage * (currentPage - 1)  //跳过多少条
            }
        ).then(function (result) {
            res.render('equipment/list.ejs', { equipment: result });
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


//获取设计详细信息
router.get('/findById', login.checkin, function (req, res, next) {
    var designId = req.query.designId;
    db.Design.findById(designId).then(function (result) {
        res.render('design/info.ejs',{ design: result ,moment: require("moment")});
    }).catch(next);
});

module.exports = router;