'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');
const db = require("../app/db/");
//
const config = require('../config.json');
const wechat = require('../wechat/wechat');
//
var wechatApp = new wechat(config); 

module.exports = function (app) {
    db.initmaterial();
    // app.use('/device',require("../app/material/controllers/index"));

    app.get('/material', function (req, res) {
        res.render('material/views/index.ejs');
    });

    app.use('/material/supplybook',require("../app/material/controllers/supplybook"));
    app.use('/material/supply',require("../app/material/controllers/supply"));

    


};