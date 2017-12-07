var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");

//设备列表
router.get('/list', login.checkin, function (req, res, next) {
    //sign用来区别是否跳分配设备
    var sign = req.query.sign;
    var projectId = req.query.projectId;
    var keyword = req.query.keyword;
    var equipmenttype = req.query.equipmenttype;
    var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Equipment.findAll(
            {
                'limit': countPerPage,                      //每页多少条
                'offset': countPerPage * (currentPage - 1)  //跳过多少条
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"equipment_type"
            }
        }),
        db.AdminInfo.findAll({
            'where': {
                roleId:5
            }
        })
        ]).then(function(result){
            res.render('equipment/list2.ejs', 
                { projectId:projectId,equipmenttype:equipmenttype,adminInfo:result[2],dictionary:result[1],keyword:keyword,countPerPage:countPerPage,currentPage:currentPage,equipment: result[0],moment: require("moment") }
            );
      }).catch(next);
});



router.post('/list', login.checkin, function (req, res, next) {
    var keyword = req.body.keyword;
    var equipmenttype = req.body.equipmenttype;
    var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Equipment.findAll(
            {
                'limit': countPerPage,                      //每页多少条
                'offset': countPerPage * (currentPage - 1),  //跳过多少条
                'where': {
                    equipmenttype:equipmenttype,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'code': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'location': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"equipment_type"
            }
        }),
        db.AdminInfo.findAll({
            'where': {
                roleId:5
            }
        })
        ]).then(function(result){
            res.render('equipment/list2.ejs', 
                { equipmenttype:equipmenttype,adminInfo:result[2],dictionary:result[1],keyword:keyword,countPerPage:countPerPage,currentPage:currentPage,equipment: result[0],moment: require("moment") }
            );
      }).catch(next);
});

router.get('/info', login.checkin, function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Equipment.findById(equipmentId),
        db.Dictionary.findAll({
            'where': {
                dicttype:"equipment_type"
            }
        }),
        db.AdminInfo.findAll({
            'where': {
                roleId:5
            }
        }),
        db.Dictionary.findAll({
            'where': {
                dicttype:"work_state"
            }
        }),
        db.Dictionary.findAll({
            'where': {
                dicttype:"equipment_state"
            }
        }),
        db.Equipmentparameter.findAll({
            'limit': countPerPage,                      //每页多少条
            'offset': countPerPage * (currentPage - 1),  //跳过多少条
            'order': [
                ['created_at', 'DESC']
            ],
            'where': {
                equipmentId:equipmentId
            }
        })
        ]).then(function(result){
            res.render('equipment/info.ejs',
            {equipParams:result[5], equipmentState:result[4], workState:result[3], adminInfo:result[2],equipmentType:result[1],equipment: result[0],moment: require("moment") });
      }).catch(next);
});

router.get('/add', login.checkin, function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    Promise.all([
        db.Equipment.findOne({
            'where': {
                id:equipmentId
            }
        }),
        db.Dictionary.findAll({
            'where': {
                dicttype:"equipment_type"
            }
        }),
        db.AdminInfo.findAll({
            'where': {
                roleId:5
            }
        })
        ]).then(function(result){
        res.render('equipment/add.ejs', 
        {adminInfo:result[2],dictionary:result[1], equipment: result[0],moment: require("moment") });
      }).catch(next);
});

router.post('/addEquipment', login.checkin, function (req, res, next) {
    var admin = req.session.admin;
    var equipmentId = req.body.equipmentId;
    var name = req.body.name;
    var code = req.body.code;
    // var priority = req.body.priority;
    var warrantyperiod = req.body.warrantyperiod;
    var customer = req.body.customer;
    var state = req.body.state;
    var workstate = req.body.workstate;
    var buytime = req.body.buytime;
    var location = req.body.location;
    var jiameng = req.body.jiameng;
    var equipmenttype = req.body.equipmenttype;

    if(equipmentId == undefined || equipmentId == ''){
        equipmentId = uuid.v1();
    }

    var equipment = {
        id:equipmentId,
        name:name,
        // adminInfoId:admin.id,
        code:code,
        location:location,
        state:state,
        // priority:priority,
        warrantyperiod:warrantyperiod,
        customer:customer,
        workstate:workstate,
        buytime:buytime,
        jiameng:jiameng,
        equipmenttype:equipmenttype
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
    db.Sequelize.query(
        "SELECT ep.*,e.`code`,e.`name`,e.buytime,e.customer from equipmentparameter ep JOIN equipment as e on e.id = ep.equipment_id ORDER BY ep.created_at desc"
    ).then(function (result) {
        res.render('equipment/map.ejs',{equipment:result[0]});
    }).catch(next);
});


//设备数据接口
router.get('/equipmentData', function (req, res, next) {
    db.Sequelize.query(
        "SELECT ep.*,e.`code`,e.`name`,e.buytime,e.customer from equipmentposition ep JOIN equipment as e on e.id = ep.equipment_id where NOT exists (SELECT 1 FROM equipmentposition where ep.equipment_id = equipment_id and created_at>ep.created_at)"
    ).then(function (result) {
        res.json(result[0]);
    }).catch(next);
});

router.get('/checkCode', function (req, res, next) {
    var code = req.query.code;
    var oldCode = req.query.oldCode;
    db.Equipment.findOne({
        "where":{
            code:code
        }
    }).then(function (result) {
        var temp = true;
        if(code!=undefined&&code == oldCode){
            // temp = false;
            res.json(true);
        }else if(result!=null){
            // temp = false;
            res.json(false);
        }else{
            res.json(true);
        }
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

//根据设备编码获取任务中的设计文件
router.get('/getDesignByCode', function (req, res, next) {
    var basePath = 'http://192.168.31.108:3000/';
    var username = req.query.username;
    var password = req.query.password;
    var passwordsd = md5(password);
    var mac = req.query.mac;
    db.AdminInfo.findOne({
        where: {
            adminname: username,
            password: passwordsd
        }
    }).then(function (result) {
        if (result != null) {
            db.Sequelize.query(
                "SELECT pj.`name`,CONCAT('"+basePath+"',dg.path) as path,dg.size from project as pj LEFT JOIN design as dg ON dg.id=pj.design_id where pj.equipment_id = (SELECT eq.id from equipment as eq where eq.`code` = '"+mac+"')"
            ).then(function (result) {
                res.json(result[0]);
            });
        } else {
            res.json("用户或密码错误！");
        }
    });
});





//获取设备详细信息
router.get('/findById', login.checkin, function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    db.Equipment.findById(equipmentId).then(function (result) {
        res.render('equipment/info.ejs',{ equipment: result ,moment: require("moment")});
    }).catch(next);
});

//设备列表（分页）
router.get('/jsonData', function (req, res, next) {
    var countPerPage = 10;
    var currentPage = req.query.page;
    db.Equipment.findAll(
        {
            'limit': countPerPage,                      //每页多少条
            'offset': countPerPage * (currentPage - 1)  //跳过多少条
        }
    ).then(function (result) {
        res.render('equipment/list2.ejs', { countPerPage:countPerPage,currentPage:currentPage,equipment: result,moment: require("moment") });
        // res.json(result);
    });
});


//插入设备信息的接口（GET）
router.get('/uploadData', function (req, res, next) {
    var mac = req.query.mac;
    var state = req.query.state;
    var firststartdate = req.query.firststartdate;
    var startdate = req.query.startdate;
    var worktimes = req.query.worktimes;
    var output = req.query.output;
    var cuttingtimes = req.query.cuttingtimes;
    var project = req.query.project;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var elevation = req.query.elevation;
    var temperature = req.query.temperature;
    var supplies = req.query.supplies;
    var speed = req.query.speed;
    var oilpressure = req.query.oilpressure;

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
            res.json(result1);
        }).catch(next);
    }).catch(next);
});


//插入设备信息的接口（POST）
router.post('/uploadData', function (req, res, next) {
    var mac = req.body.mac;
    var state = req.body.state;
    var firststartdate = req.body.firststartdate;
    var startdate = req.body.startdate;
    var worktimes = req.body.worktimes;
    var output = req.body.output;
    var cuttingtimes = req.body.cuttingtimes;
    var project = req.body.project;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var elevation = req.body.elevation;
    var temperature = req.body.temperature;
    var supplies = req.body.supplies;
    var speed = req.body.speed;
    var oilpressure = req.body.oilpressure;

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
            res.json(result1);
        }).catch(next);
    }).catch(next);
});



module.exports = router;