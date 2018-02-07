var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var https = require('https');
var cdohttps = require('../../uitl/cdohttps');
var dingauth=require('./dingauth');


//供应商列表req.corpIdreq.corpsecret
router.get('/list' , function (req, res) {
    new dingauth().getaccesstokan().then(function(token){
            var path = 'https://oapi.dingtalk.com/department/list?' + querystring.stringify({
            access_token: token,
            id:49517483});
            new cdohttps().requestGet(path).then(function(result){ 
                res.json(result);
            });
    }).catch(function(error)
    {

    });
});

router.get('/user/simplelist' , function (req, res) { 
    new dingauth().getaccesstokan().then(function(token){
        var path = 'https://oapi.dingtalk.com/user/simplelist?' + querystring.stringify({
            access_token: token,
            department_id:req.query.department_id
        });
        new cdohttps().requestGet(path).then(function(data){ 
            res.json(data);
        });
    }).catch(function(error)
    {

    });
});

router.get('/user/list' , function (req, res) { 
    new dingauth().getaccesstokan().then(function(token){
        var path = 'https://oapi.dingtalk.com/user/list?' + querystring.stringify({
            access_token: token,
            department_id:req.query.department_id
        });
        new cdohttps().requestGet(path).then(function(data){ 
            res.json(data);
        });
    }).catch(function(error)
    {

    });
});

router.get('/manage' , function (req, res) {
    res.render('sso/views/department.ejs');
});


module.exports = router;