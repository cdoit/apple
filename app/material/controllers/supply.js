var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../../db/");
var httpUtil = require('../../util/http');
var querystring = require('querystring');
//物料价格列表
router.get('/list' , function (req, res, next) { 
    // 物料编码
    var materialId = req.query.materialId;
    var keyword = req.query.keyword;
    var pageNo = req.query.pageNo;
    var pageSize = req.query.pageSize;
    if(keyword ==  undefined || keyword == null || keyword == "undefined"){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    
    Promise.all([
        db.Supply.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),      //跳过多少条
                'where': {
                    'materialId': materialId
                } 
            }
        ),
        db.Supply.count(
            {
                'where': {
                    'materialId': materialId
                } 
            }
        ),
        db.Supplybook.findAll()
        ]).then(function (result) {
        var total = result[1];
        var totalPage = Math.ceil(result[1] / pageSize);
        res.render('material/views/supply/list.ejs',
        {supplybook:result[2], totalPage:totalPage, total:total, pageSize:pageSize,pageNo:pageNo,supply: result[0] ,keyword:keyword,moment: require("moment")});
    }).catch(next);
});

router.post('/list' , function (req, res, next) { 
    var materialId = req.body.materialId;
    var keyword = req.body.keyword;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;
    if(keyword ==  undefined || keyword == null || keyword == "undefined"){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    
    Promise.all([
        db.Supply.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),      //跳过多少条
                'where': {
                    'materialId': materialId
                }
            }
        ),
        db.Supply.count(
            {
                'where': {
                    'materialId': materialId
                }
            }
        ),
        db.Supplybook.findAll()
        ]).then(function (result) {
        var total = result[1];
        var totalPage = Math.ceil(result[1] / pageSize);
        res.render('material/views/supply/list.ejs',
        {supplybook:result[2],totalPage:totalPage, total:total, pageSize:pageSize,pageNo:pageNo,supply: result[0] ,keyword:keyword,moment: require("moment")});
    }).catch(next);
});


router.get('/add', function (req, res, next) {
    var path = '/cdo/sso/gettoken?' + querystring.stringify({
        corpid: "ding865f2022dc64284135c2f4657eb6378f",
        corpsecret: "Bo67en-DR4aBMYHV-BczWlIWiFFa_aAla5kZbyc9JGwcHs6g2K2TWrtbZ1GWWqIH"
        });
        
    httpUtil.get(path, res);
    // var supplyId = req.query.supplyId;
    // Promise.all([
    //     db.Supply.findOne({
    //         'where': {
    //             id:supplyId
    //         }
    //     }),
    //     db.Supplybook.findAll()
    //     ]).then(function(result){
    //     res.render('material/views/supply/add.ejs',
    //     { supplybook:result[1],supply: result[0],moment: require("moment") });
    //   }).catch(next);
});

router.post('/addSupply', function (req, res, next) {
    var supplybookId = req.body.supplybookId;
    var supplyId = req.body.supplyId;
    var materialId = req.body.materialId;
    var supplyprice = req.body.supplyprice;
    
    if(supplyId == undefined || supplyId == ''){
        supplyId = uuid.v1();
    }

    //判断materialId（物料编码是否存在）
    db.Material.insertOrUpdate({
        id:materialId,
        materialcategoryid:1,
        name:'',
        unit:'m',
        attributeinfo:''
    }).then(function (result) {
        //添加物料价格
        db.Supply.insertOrUpdate({
            id:supplyId,
            supplybookId:supplybookId,
            materialId:materialId,
            supplyprice:supplyprice
        }).then(function (result) {
            res.redirect("/material/supply/list");
        }).catch(next);
    });
});


router.get('/delete', function (req, res, next) {
    var supplyId = req.query.supplyId;
        var filter = {
            where: {
                id:supplyId
            }
        }
        db.Supply.destroy(filter).then(function (result) {
            res.json(result);
        }).catch(next);
});

module.exports = router;