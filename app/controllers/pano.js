var express = require('express');
var login = require('./login');
var router = express.Router();
const db = require("../db/");
var uuid = require('node-uuid'); 

router.get('', function (req, res) {
    var productobj=new Object();
    productobj.panos=[];
    var productid=req.query.productid;
    var filter = {
        where: {
            productId:productid
        },
        'order': [
            ['category']
        ]
    }
    db.Panorama.findAll(filter).then(function (data) {
        if(data!=null&&data.length>0)
        {
            res.render('common/pano',{panos:data});
        }
        else
        {
            res.render('common/pano',{panos:null});
            res.end();
        }
    })
    .catch(function(erorr )
    {
        res.render('common/pano',{panos:null});
    });
})

module.exports = router;