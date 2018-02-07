var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var https = require('https');
var cdohttps = require('../../uitl/cdohttps');
var dingauth=require('./dingauth');


//供应商列表req.corpIdreq.corpsecret
router.get('/list' , function (req, res) {
    // var token = req.query.access_token ;
    // if(token == null || token == undefined || token == ''){
    //     token = req.session.token;
    // }
    new dingauth().getaccesstokan().then(function(data){
            var path = 'https://oapi.dingtalk.com/department/list?' + querystring.stringify({
            access_token: data,
            id:49517483});
            console.log('path:'+path);
            new cdohttps().requestGet(path).then(function(result){ 
                res.json(result);
            });
    }).catch(function(error)
    {

    });
    
});

router.get('/user/simplelist' , function (req, res) { 
    var path = 'https://oapi.dingtalk.com/user/simplelist?' + querystring.stringify({
        access_token: req.query.access_token,
        department_id:req.query.department_id
      });
    new cdohttps().requestGet(path).then(function(data){ 
        res.json(data);
    });
});

router.get('/user/list' , function (req, res) { 
    var token = req.query.access_token ;
    if(token == null || token == undefined || token == ''){
        token = req.session.token;
        console.log("session:"+req.session.token);
    }
    var path = 'https://oapi.dingtalk.com/user/list?' + querystring.stringify({
        access_token: token,
        department_id:req.query.department_id
      });
    new cdohttps().requestGet(path).then(function(data){ 
        res.json(data);
    });
});

router.get('/manage' , function (req, res) {
    res.render('sso/views/department.ejs');
});


module.exports = router;