var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var cdohttp = require('../../uitl/cdohttp');


//供应商列表req.corpIdreq.corpsecret
router.get('/' , function (req,res) { 
    console.log('code:'+req.query.code);
    var path = '/cdo/sso/user/getuserinfo?' + querystring.stringify({
        code:req.query.code
    });
    new cdohttp().requestGet('127.0.0.1',3000,path).then(function(data){ 
        console.log(data);
        res.json(data);
    });
});

module.exports = router;