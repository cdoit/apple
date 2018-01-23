var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../../db/");

//获取物料类型树的接口
router.get('/tree2', function (req, res, next) {
    db.Materialcategory.findAll().then(function (result) {
        res.json(result);
    }).catch(next);
});

//获取物料类型树的接口
router.get('/tree', function (req, res, next) {
    db.Sequelize2.query(
       "SELECT mc.id,mc.`name`,mc.parentid from materialcategory as mc  UNION all SELECT m.id,m.`name`,m.materialcategory_id as parentid from material as m"
    ).then(function (result) {
        res.json(result[0]);
    });
});

router.get('/isParent', function (req, res, next) {
    var MaterialcategoryId = req.query.MaterialcategoryId;
    db.Materialcategory.findOne({
//物料价格列表
router.get('/codetip' , function (req, res, next) { 
    var keyword = req.query.code;
    if(keyword ==  undefined || keyword == null || keyword == "undefined"){
        keyword = "";
    }
    Promise.all([
        db.Material.findAll(
            {
                'limit': 10,                      //每页多少�
        'where': {
                'where': {
            parentid:MaterialcategoryId
                    '$or': [
                        {'id': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
        }
            } 
    }).then(function (result) {
        if(result!=null){
            res.json(true);
        }else{
            res.json(false);
            }
        }
        )
        ]).then(function (result) {
            var total = result[0];
            res.json(total);
    }).catch(next);
});




router.get('/getNum', function (req, res, next) {
    var MaterialcategoryId = req.query.MaterialcategoryId;
    db.Material.findAll({
        'where': {
            materialcategoryid:MaterialcategoryId
        },
        'attributes': ['id']
    }).then(function (result) {
        res.json(result);
    }).catch(next);
});



module.exports = router;