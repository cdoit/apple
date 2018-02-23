'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');
const db = require("../app/db/");

module.exports = function (app) {
    app.use('/cdo/labor',require("../app/labor/controllers/index"));
 
};