﻿var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");
var multer  = require('multer');
var fs = require('fs');

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './public/upload/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now());  
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

//方案列表
router.get('/list', login.checkin, function (req, res, next) {
    var keyword = req.query.keyword;
    var countPerPage = 10, currentPage = 1;
    db.Scheme.findAll(
        {
            'limit': countPerPage,                      //每页多少条
            'offset': countPerPage * (currentPage - 1)  //跳过多少条
        }
    ).then(function (result) {
        res.render('scheme/list.ejs', {keyword:keyword,countPerPage:countPerPage,currentPage:currentPage, schemes: result ,moment: require("moment")});
    });
});

router.post('/list', login.checkin, function (req, res, next) {
    var keyword = req.body.keyword;
    var countPerPage = 10, currentPage = 1;
    db.Scheme.findAll(
        {
            'limit': countPerPage,                      //每页多少条
            'offset': countPerPage * (currentPage - 1) , //跳过多少条
            'where': {
                'name': {
                    '$like': '%'+keyword+'%'      
                }
            }
        }
    ).then(function (result) {
        res.render('scheme/list.ejs', {keyword:keyword,countPerPage:countPerPage,currentPage:currentPage, schemes: result ,moment: require("moment")});
    });
});

router.get('/add', login.checkin, function (req, res, next) {
    var schemeId = req.query.schemeId;
    var filter = {
        where: {
            id:schemeId
        }
    }
    db.Scheme.findOne(filter).then(function (result) {
        res.render('scheme/add.ejs', { scheme: result,moment: require("moment") });
    }).catch(next);
});

router.post('/addScheme',upload.single('file1'), login.checkin, function (req, res, next) {
    var admin = req.session.admin;
    var schemeName = req.body.schemeName;
    var schemeId = req.body.schemeId;

    //图片上传
    var file = req.file;
    var path ;
    if(file!=undefined){
        //以下代码得到文件后缀
        var name = file.originalname;
        var nameArray = name.split('');
        var nameMime = [];
        var l = nameArray.pop();
        nameMime.unshift(l);
        while (nameArray.length != 0 && l != '.') {
            l = nameArray.pop();
            nameMime.unshift(l);
        }
        //Mime是文件的后缀
        var Mime = nameMime.join('');
        console.log(Mime);
        fs.renameSync('./public/upload/'+file.filename,'./public/upload/'+file.filename+Mime);
        console.log('./public/upload/'+file.filename+Mime);
        // 图片路劲
        path = 'public/upload/'+file.filename+Mime;
    }

    //判断是否新增
    if(schemeId == undefined || schemeId == ''){
        schemeId = uuid.v1();
    }

    //判断是否上传了文件数据
    var scheme;
    if(file!=undefined){
        scheme = {
            id:schemeId,
            name:schemeName,
            adminInfoId:admin.id,
            path:path,
            confirmtime:new Date(),
            state:0
        };
    }else{
        scheme = {
            id:schemeId,
            name:schemeName,
            adminInfoId:admin.id,
            confirmtime:new Date(),
            state:0
        };
    }

    db.Scheme.insertOrUpdate(scheme).then(function (result) {
        res.redirect("/scheme/list");
    });

    // res.render('manager/addScheme.ejs');
    });


    router.get('/delete', login.checkin, function (req, res, next) {
        var schemeId = req.query.schemeId;
            var filter = {
                where: {
                    id:schemeId
                }
            }
            db.Scheme.destroy(filter).then(function (result) {
                res.json(result);
            }).catch(next);
    });

//获取方案详细信息
router.get('/findById', login.checkin, function (req, res, next) {
    var schemeId = req.query.schemeId;
    db.Scheme.findById(schemeId).then(function (result) {
        res.render('scheme/info.ejs',{ scheme: result,moment: require("moment") });
    }).catch(next);
});

router.get('/download', function (req, res,next) {
    var schemeId = req.query.schemeId;
    db.Scheme.findById(schemeId).then(function (result) {
        res.download(result.path);
    }).catch(next);
    // res.download('upload/logo-1508833808696.png');
  });

module.exports = router;