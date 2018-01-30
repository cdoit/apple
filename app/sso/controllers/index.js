var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../../db/");

//物料价格列表
router.get('/' , function (req, res, next) { 
    res.render('sso/views/index.ejs',null);
});

module.exports = router;