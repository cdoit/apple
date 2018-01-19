'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');
const db = require("../app/db/");
//
const config = require('../config.json')
const wechat = require('../wechat/wechat');
//
var wechatApp = new wechat(config); 

const home = require('../app/device/controllers/home');
// const project = require('../app/controllers/project');
const test = require('../app/device/controllers/test');

var webchatTest = new test(db);
const login = require('../app/device/controllers/login');

//
var http = require('http');
var multer  = require('multer');
var md5=require("md5");
//
var admin = require('../app/device/controllers/manager');



var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './upload/';

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


function getopenid(req, res, next) {
    req.session.openid = req.query.openid;
    next();
}

module.exports = function (app) {
    db.initdevice();
    app.get('/testmicroservice', home.testmicroservice);
    // // 微服务
    // app.get('/findByEquiCode', project.findByEquiCode);

    app.use(function(req, res, next){
        res.locals.admin = req.session.admin;
        next();
    });

    app.get('/device', function (req, res) {
        res.render('device/views/manager/login.ejs');
    });

    app.get('/device/login', function (req, res) {
        res.render('device/views/manager/login.ejs');
    });

    // app.all('*', function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //     res.header("X-Powered-By",' 3.2.1')
    //     res.header("Content-Type", "application/json;charset=utf-8");
    //     next();
    // });

    //
    //登陆
    app.post('/device/login', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var passwordsd = md5(password)  
        db.AdminInfo.findOne({
            where: {
                adminname: username,
                password: passwordsd
            }
        }).then(function (result) {
            if (result != null) {
                req.session.admin = result;
                // req.session.adminname = result.adminname;
                res.redirect("/device/manager/index");
            } else {
                res.render('device/views/manager/login.ejs');
            }
        });
    });

    app.get('/device/logout', function (req, res) {
        req.session.admin = null;
        res.redirect("/device/manager/index");
    });

    app.post('/uploadSingle', upload.single('file1'), function(req, res, next){
            var file = req.file;
        
            // console.log('文件类型：%s', file.mimetype);
            // console.log('原始文件名：%s', file.originalname);
            // console.log('文件大小：%s', file.size);
            // console.log('文件保存路径：%s', file.path);

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
            fs.renameSync('./upload/'+file.filename,'./upload/'+file.filename+Mime);
            // res.send('./upload/'+file.filename+Mime);
            //凑json数据
            var obj = new Object;
            obj.status = "true";
            obj.val = './upload/'+file.filename+Mime;
            res.json(obj);
    });

    app.get('/download', function (req, res,next) {
        res.download(req.query.path);
    });

    //
    app.get("/admin/show", function (req, res, next) {
        //
        db.User.findAll().then(function (users) {
            res.render('manager/userlist.ejs', { users: users });
        });
    });
    app.get("/admin/edit", function (req, res, next) {
        //
        db.User.findAll().success(function (users) {
            res.render('home/userlist.ejs', { users: users });

        });
    });
    app.get("/admin/delete", function (req, res, next) {
        //
        var userid = req.query.userid;

        //
        db.User.destroy({ where: { userid: userid } }).then(function (rowDeleted) {
            if (rowDeleted === 0) {
                res.redirect("/admin/show");
            } else {
                res.write("111");
                res.end();
            }

        })

    });



    app.post('/device/login', function (req, res, next) {

        next();
    });

    app.use('/device/scheme',require("../app/device/controllers/scheme"));
    app.use('/device/manager',require("../app/device/controllers/manager"));
    app.use('/device/equipment',require("../app/device/controllers/equipment"));
    app.use('/device/project',require("../app/device/controllers/project"));
    app.use('/device/design',require("../app/device/controllers/design"));

    // app.use(function (err, req, res, next) {
    //     if (err.message
    //         && (~err.message.indexOf('not found')
    //             || (~err.message.indexOf('Cast to ObjectId failed')))) {
    //         return next();
    //     }
    //     console.error(err.stack);
    //     res.status(500).render('500', { error: err.stack });
    // });

    // app.use(function (req, res, next) {
    //     res.status(404).render('404', {
    //         url: req.originalUrl,
    //         error: 'Not found'
    //     });
    // });
};
