var https = require('https');
var querystring = require('querystring');
var express = require('express');
var router = express.Router();


module.exports = function (app) {
    app.use('/',require("../app/dingtalk/controllers/auth"));
};