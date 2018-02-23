var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var cdohttps = require('../../uitl/cdohttps');
var dingauth=require('./dingauth');


//供应商列表req.corpIdreq.corpsecret
router.get('/gettoken' , function (req,res) { 
    new dingauth().getaccesstokan().then(function(data){
        res.json(data);

    }).catch(function(error)
    {

    });
});

router.get('/user/getuserinfo' , function (req,res) { 
    new dingauth().getaccesstokan().then(function(token){
        var path = 'https://oapi.dingtalk.com/user/getuserinfo?' + querystring.stringify({
            access_token: token,
            code:req.code
        });
        new cdohttps().requestGet(path).then(function(data){ 
            res.json(data);
        });

    }).catch(function(error)
    {
        console.log(error);
    });
});

module.exports = router;