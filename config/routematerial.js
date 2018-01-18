'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');
const db = require("../app/db/");
//
const config = require('../config.json')

module.exports = function (app) {
    db.initmaterial();
    app.get('/material', function (req, res) {
        res.render('material/views/index.ejs');
    });
};