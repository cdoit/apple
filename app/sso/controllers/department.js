var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var https = require('https');

//供应商列表req.corpIdreq.corpsecret
router.get('/list' , function (req, res) { 
    var path = 'oapi.dingtalk.com/department/list?' + querystring.stringify({
        access_token: req.query.access_token,
      });
    
    new Promise(function(resolve, reject) {
        https.get('https://'+path, function(response){
            resolve(response);
        });
    }).then(function(response){
        var body="";
        response.setEncoding('utf8');
        response.on('data', function (data) {
                    body += data; 
                }).on('end', function () { 
                    var result = body;
                    jsonresult=JSON.parse(result);
                });     
    });
});



router.get('/test' , function (req, res) { 
    res.render('sso/views/department.ejs');
});


module.exports = router;