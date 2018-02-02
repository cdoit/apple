var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../../db/");
var querystring = require('querystring');
var https = require('https');
var cdohttps = require('../../uitl/cdohttps');

//物料价格列表
router.get('/' , function (req, res, next) {
    var token = req.session.token;
    if(token == null || token == undefined || token == ""){
        var path = 'https://oapi.dingtalk.com/gettoken?' + querystring.stringify({
            corpid: 'ding865f2022dc64284135c2f4657eb6378f',//'ding865f2022dc64284135c2f4657eb6378f',
            corpsecret: 'n9Y9w6csnHe936UYKAmBBaGNoivc-Zu-iLQV4pf4FP1uym-ekx_9WGMeohe4az8x'});//'Bo67en-DR4aBMYHV-BczWlIWiFFa_aAla5kZbyc9JGwcHs6g2K2TWrtbZ1GWWqIH'});
            new cdohttps().requestGet(path).then(function(data){
                var obj = JSON.parse(data); 
                req.session.token = obj.access_token;
                // res.json(data);
                res.render('sso/views/index.ejs',null);
            });
    }else{
        res.render('sso/views/index.ejs',null);
    }
    
    // res.render('sso/views/index.ejs',null);
});

module.exports = router;