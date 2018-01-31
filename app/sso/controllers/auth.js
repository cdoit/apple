var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var https = require('https');

//供应商列表req.corpIdreq.corpsecret
router.get('/gettoken' , function (req,res) { 
    var path = 'oapi.dingtalk.com/gettoken?' + querystring.stringify({
        corpid: req.query.corpid,
        corpsecret: req.query.corpsecret});
    
    new Promise(function(resolve, reject) {
        https.get('https://'+path, function(response){
            resolve(response);
        });
    }).then(function(response){
        var body="";
        response.on('data', function (data) {
                    body += data; 
                }).on('end', function () { 
                    var result = JSON.parse(body);
                    if (result && 0 === result.errcode) {
                        res.json(result);
                    }
                    else {
                        var err={"status":"0","msg":result.errcode};
                        res.json(err);
                    }
                });     
        });
});

module.exports = router;