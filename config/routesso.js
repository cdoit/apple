var https = require('https');
var querystring = require('querystring');
var express = require('express');
var router = express.Router();


module.exports = function (app) {
    app.use('/cdo/sso',require("../app/sso/controllers/auth"));
    app.use('/cdo/sso/manage/',require("../app/sso/controllers/index"));
    app.use('/cdo/sso/department',require("../app/sso/controllers/department"));
    
};