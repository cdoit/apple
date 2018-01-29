var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var httpUtil = require('../../util/http');

//供应商列表
router.get('/gettoken' , function (req, res, next) { 
    var path = 'oapi.dingtalk.com/gettoken?' + querystring.stringify({
        corpId: req.corpid,
        corpsecret: req.secret
      });
      console.log("url:"+path);
      httpUtil.get(path, res);
});

module.exports = router;