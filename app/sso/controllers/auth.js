var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var cdohttps = require('../../uitl/cdohttps');


//供应商列表req.corpIdreq.corpsecret
router.get('/gettoken' , function (req,res) { 
    var path = 'oapi.dingtalk.com/gettoken?' + querystring.stringify({
        corpid: req.query.corpid,
        corpsecret: req.query.corpsecret});
        cdohttps.requestGet(path).then(function(data){
            var result = JSON.parse(data); 
            resolve(result.access_token);
        });
    // new Promise(function(resolve, reject) {
    //     https.get('https://'+path, function(response){
    //         resolve(response);
    //     });
    // }).then(function(response){
    //     var body="";
    //     response.setEncoding('utf8');
    //     response.on('data', function (data) {
    //                 body += data; 
    //             }).on('end', function () { 
    //                 var result = body;
    //                 res.json(result);
    //             });     
    //     });
});

module.exports = router;