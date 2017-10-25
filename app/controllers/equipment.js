var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");

//方案列表
router.get('/list', login.checkin, function (req, res, next) {
    
        db.Equipment.findAll().then(function (result) {
    
            res.render('equipment/list.ejs', { equipment: result });
        });
    });


router.get('/add', login.checkin, function (req, res, next) {
    
    res.render('equipment/add.ejs');
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


module.exports = router;