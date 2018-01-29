var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var querystring = require('querystring');
var httpUtil = require('../../util/http');

//供应商列表req.corpIdreq.corpsecret
router.get('/gettoken' , function (req, res, next) { 
    var path = 'oapi.dingtalk.com/gettoken?' + querystring.stringify({
        corpId: "ding865f2022dc64284135c2f4657eb6378f",
        corpsecret: "Bo67en-DR4aBMYHV-BczWlIWiFFa_aAla5kZbyc9JGwcHs6g2K2TWrtbZ1GWWqIH"
      });
      console.log("url:"+path);
      httpUtil.get(path, res);
});

module.exports = router;