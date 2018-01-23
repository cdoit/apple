var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../../db/");

//物料价格列表
router.get('/codetip' , function (req, res, next) { 
    var keyword = req.query.code;
    if(keyword ==  undefined || keyword == null || keyword == "undefined"){
        keyword = "";
    }
    Promise.all([
        db.Material.findAll(
            {
                'limit': 10,                      //每页多少条
                'where': {
                    '$or': [
                        {'id': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
            } 
            }
        )
        ]).then(function (result) {
            var total = result[0];
            res.json(total);
    }).catch(next);
});

module.exports = router;