var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var httpUtil = require('../../util/https');

//供应商列表req.corpIdreq.corpsecret
router.get('/gettoken' , function (req, res) { 
    var path = 'oapi.dingtalk.com/gettoken?' + querystring.stringify({
        corpid: req.query.corpId,
        corpsecret: req.query.corpsecret
      });
      console.log("second url:"+path);
      httpUtil.get(path, res);
      
});

module.exports = router;