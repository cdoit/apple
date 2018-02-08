'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');
const db = require("../app/db/");
// db.init();
//
const config = require('../config.json')
// const wechat = require('../wechat/wechat');
// //
// var wechatApp = new wechat(config); 
// // const login = require('../app/controllers/login');
// const weixinserver = require('../wechat/weixin');



// function getopenid(req, res, next) {
//     req.session.openid = req.query.openid;
//     next();
// }

module.exports = function (app) {

    // app.get('/wx/qrcode', weixinserver.qrcode);
    

};
