var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");
var seneca = require('seneca');
var async = require('async'); 

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

//任务分配（地图）
router.get('/fenfaMap', login.checkin, function (req, res, next) {
    res.render('project/map.ejs');
});

//任务分配（列表）  分配机器
router.get('/fenfaList', login.checkin, function (req, res, next) {
    var projectId = req.query.projectId;
    var countPerPage = 10, currentPage = 1;
    db.Equipment.findAll(
        {
            'limit': countPerPage,                      //每页多少条
            'offset': countPerPage * (currentPage - 1),  //跳过多少条
            'where': {
                workstate: '1'  //空闲
            }
        }
    ).then(function (result) {
        res.render('project/equipmentList.ejs', { equipment: result,projectId:projectId });
    });
});

router.get('/fenpei', login.checkin, function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    var projectId = req.query.projectId;
    // if(equipmentId != undefined || equipmentId != null){
    //将设备id与该任务管理，并且改任务状态
    var filter = {
        equipmentId:equipmentId,
        progress:'2'   

    }
    db.Project.update(
        filter,
        {
            where: {
                id:projectId
            }
        }
    ).then(function (result) {
        //并且改equipment表的状态
        var contdition = {
            workstate:'2'   
    
        }
        db.Equipment.update(
            contdition,
            {
                where: {
                    id:equipmentId
                }
            }
        ).then(function (result) {
            res.json(result);
        }).catch(next);
    }).catch(next);
});


router.get('/findByEquiCode' ,login.checkin, function (req, res, next) {
    res.render('project/equipProjectList.ejs', { project: null,equipmentCode:'' });
});


router.post('/findByEquiCode' ,login.checkin, function (req, res, next) {
    var equipmentCode = req.body.equipmentCode;
    return new Promise((resolve, reject) => {
      seneca()
      .client({port: 8000,type: 'tcp'})
      .act({role: 'project',cmd: 'getProject',left: equipmentCode,right: 2}, (err, result) => {
        if (err) {
          return console.error(err);
        }
        else
        {
            // res.json(result);
            res.render('project/equipProjectList.ejs', { project: result,equipmentCode:equipmentCode });
        }
      });
       
    })
});


// 待设计的任务列表
router.get('/todoDesign', login.checkin, function (req, res, next) {
    var flag = req.query.flag;
    var designerId = null;
    if(flag!=null&&flag!=undefined){
        designerId = req.session.admin.id;
    }
    var countPerPage = 10, currentPage = 1;
    db.Project.findAll(
        {
            'limit': countPerPage,                      //每页多少条
            'offset': countPerPage * (currentPage - 1),  //跳过多少条
            'where': {
                equipmentId:null,
                designId:null,
                designerId:designerId,
                '$not': [
                    {'schemeId': null}
                ]
            }
        }
    ).then(function (result) {
        res.render('project/todoDesignList.ejs', { project: result });
    });
});



//接单操作（这里需要判断是否存在多个接单，还未处理）
router.get('/jiedan', login.checkin, function (req, res, next) {
    var flag = req.query.flag;
    var adminId = null;
    if(flag==null&&flag==undefined){
        adminId = req.session.admin.id;
    }
    var projectId = req.query.projectId;
    var filter = {
        designerId:adminId,
        // progress:'2'
    }
    db.Project.update(
        filter,
        {
            where: {
                id:projectId
            }
        }
    ).then(function (result) {
        res.redirect("/project/todoDesign");
    }).catch(next);
});


module.exports = router;