var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../../db/");

//供应商列表
router.get('/list' , function (req, res, next) { 
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
        db.Supplybook.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),      //跳过多少条
                'where': {
                    '$or': [
                        {'supplyname': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'pepole': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'tel': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
            } 
            }
        ),

        db.Supplybook.count(
            {
                'where': {
                    '$or': [
                        {'supplyname': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'pepole': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'tel': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
            } 
            }
        )
        ]).then(function (result) {
        var total = result[1];
        var totalPage = Math.ceil(result[1] / pageSize);
        res.render('material/views/supplybook/list.ejs',
        {totalPage:totalPage, total:total, pageSize:pageSize,pageNo:pageNo,supplybook: result[0] ,keyword:keyword,moment: require("moment")});
    }).catch(next);
});



router.post('/list' , function (req, res, next) { 
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
        db.Supplybook.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),      //跳过多少条
                'where': {
                    '$or': [
                        {'supplyname': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'pepole': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'tel': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
            } 
            }
        ),

        db.Supplybook.count(
            {
                'where': {
                    '$or': [
                        {'supplyname': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'pepole': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'tel': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
            } 
            }
        )
        ]).then(function (result) {
        var total = result[1];
        var totalPage = Math.ceil(result[1] / pageSize);
        res.render('material/views/supplybook/list.ejs',
        {totalPage:totalPage, total:total, pageSize:pageSize,pageNo:pageNo,supplybook: result[0] ,keyword:keyword,moment: require("moment")});
    }).catch(next);
});


router.get('/add', function (req, res, next) {
    var supplybookId = req.query.supplybookId;
    Promise.all([
        db.Supplybook.findOne({
            'where': {
                id:supplybookId
            }
        })
        ]).then(function(result){
        res.render('material/views/supplybook/add.ejs', 
        { supplybook: result[0],moment: require("moment") });
      }).catch(next);
});


router.get('/checkName', function (req, res, next) {
    var supplyname = req.query.supplyname;
    var oldSupplyname = req.query.oldSupplyname;
    db.Supplybook.findOne({
        "where":{
            supplyname:supplyname
        }
    }).then(function (result) {
        var temp = true;
        if(supplyname!=undefined&&supplyname == oldSupplyname){
            // temp = false;
            res.json(true);
        }else if(result!=null){
            // temp = false;
            res.json(false);
        }else{
            res.json(true);
        }
    }).catch(next);
});

module.exports = router;