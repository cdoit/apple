var express = require('express');
var login = require('./login');
var router = express.Router();
const db = require("../db/");


router.get('/login', function (req, res, next) {

    res.render('manager/login.ejs');
});
//登陆
router.post('/login/index', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    db.AdminInfo.findOne({
        where: {
            adminname: username,
            password: password
        }
    }).then(function (result) {
        if (result != null) {
            req.session.admin = result;
            res.redirect("/scheme/scheme");
        } else {
            res.render('/manager/login');
        }
    });
});

//访问管理页面
router.get('/', login.checkin, function (req, res, next) {

    db.AdminInfo.findAll().then(function (result) {

        res.render('manager/index.ejs', { users: result});
    });
});

router.get('/user', login.checkin, function (req, res, next) {

    db.User.findAll().then(function (result) {

        res.render('manager/user.ejs', { users: result });
    });
});

router.get('/role', login.checkin, function (req, res, next) {

    db.Role.findAll().then(function (result) {

        res.render('manager/role.ejs', { roles: result });
    });
});

router.get('/project', login.checkin, function (req, res, next) {

    db.Project.findAll().then(function (result) {

        res.render('manager/project.ejs', { projects: result });
    });
});

//方案列表
router.get('/scheme', login.checkin, function (req, res, next) {
    
        db.Scheme.findAll().then(function (result) {
    
            res.render('manager/schemes.ejs', { schemes: result });
        });
    });


router.get('/test', login.checkin, function (req, res, next) {
    
    res.render('manager/test.ejs');
    });

router.get('/order', login.checkin, function (req, res, next) {
    
        // db.Order.findAll().then(function (result) {
    
        //     res.render('manager/order.ejs', { order: result });
        // });
        db.Sequelize.query("SELECT o.*,p.`name`,a.adminname from `order` as o LEFT JOIN product as p ON o.product_id = p.id LEFT JOIN admininfo as a ON a.id = o.adminInfo_id").then(function (result) {
            res.render('manager/order.ejs', { order: result[0] });
        });
    });
module.exports = router;