var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var https = require('https');

//供应商列表req.corpIdreq.corpsecret
router.get('/department/list' , function (req, res) { 
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


    // var path = 'oapi.dingtalk.com/gettoken?' + querystring.stringify({
    //   corpid: req.query.corpId,
    //   corpsecret: req.query.corpsecret
    // });
    // console.log("second url:"+path);
    // httpUtil.startget(path).then(function(body)
    // {
    //     console.log("tokan:"+body);
    //     return body;
    // }).then(function(body){
    //     var jsonobj=JSON.parse(body);
    //     var path = 'oapi.dingtalk.com/department/list?' + querystring.stringify({
    //       access_token: jsonobj.access_token,
    //     });
    //     console.log("second url:"+path);
    //     httpUtil.startget(path).then(function(body2){
    //          return body2;
    //     })
    //     res.json(body2);
    // });
});

module.exports = router;