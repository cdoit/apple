var express = require('express');
var login = require('./login');
var router = express.Router();
const db = require("../db/");

//访问管理页面
router.get('/index', login.checkin, function (req, res, next) {

    res.render('manager/index.ejs');
});

module.exports = router;