﻿var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");

//方案列表
router.get('/scheme', login.checkin, function (req, res, next) {
    
        db.Scheme.findAll().then(function (result) {
    
            res.render('manager/schemes.ejs', { schemes: result });
        });
    });


router.get('/add', login.checkin, function (req, res, next) {
    
    res.render('manager/addScheme.ejs');
    });

router.post('/addScheme', login.checkin, function (req, res, next) {
    var admin = req.session.admin;
    var name = req.body.schemeName;
    var path = req.body.path;

    var scheme = {
        id:uuid.v1(),
        name:name,
        adminInfoId:admin.id,
        path:path,
        uploadtime:new Date(),
        state:0
    };

    db.Scheme.create(scheme).then(function (result) {
        res.redirect("/scheme/scheme");
    });

    // res.render('manager/addScheme.ejs');
    });


//获取方案详细信息
router.get('/findById', login.checkin, function (req, res, next) {
    var schemeId = req.query.schemeId;
    db.Scheme.findById(schemeId).then(function (result) {
        res.render('scheme/info.ejs',{ scheme: result,moment: require("moment") });
    }).catch(next);
});


module.exports = router;