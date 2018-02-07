var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var cdohttps = require('../../uitl/cdohttps');


//供应商列表req.corpIdreq.corpsecret
router.get('/gettoken' , function (req,res) { 
    new dingauth().getaccesstokan().then(function(data){
        res.json(data);
        
    }).catch(function(error)
    {

    });

    // var path = 'https://oapi.dingtalk.com/gettoken?' + querystring.stringify({
    //     corpid: req.query.corpid,
    //     corpsecret: req.query.corpsecret});
    //     new cdohttps().requestGet(path).then(function(data){
    //         var obj = JSON.parse(data); 
    //         req.session.token = obj.access_token;
    //         res.json(data);
    //     });
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