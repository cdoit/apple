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
});

module.exports = router;