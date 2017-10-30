'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');
const db = require("../app/db/");
db.init();
//
const config = require('../config.json')
const wechat = require('../wechat/wechat');
//
var wechatApp = new wechat(config); 

const home = require('../app/controllers/home');
const test = require('../app/controllers/test');

var webchatTest = new test(db);
const login = require('../app/controllers/login');
const weixinserver = require('../wechat/weixin');
//
var http = require('http');
var multer  = require('multer')
//
var admin = require('../app/controllers/manager');

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
    db.init();


    app.get('/', function (req, res) {
        res.render('manager/login.ejs');
    });

    app.get('/login', function (req, res) {
        res.render('manager/login.ejs');
    });

    //
    //登陆
    app.post('/login', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        db.AdminInfo.findOne({
            where: {
                adminname: username,
                password: password
            }
        }).then(function (result) {
            if (result != null) {
                req.session.admin = result;
                res.redirect("/manager/index");
            } else {
                res.render('manager/login.ejs');
            }
        });
    });

    app.post('/uploadSingle', upload.single('logo'), function(req, res, next){
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
            res.json('./upload/'+file.filename+Mime);
    });

    app.get('/download', function (req, res,next) {
        var q = req.query;
        // if (q.type == 'jpg') {
      
        //   //相对路径
        //   res.download('public/1.jpg');
        // }else if (q.type == 'txt') {
      
        //   //绝对路径
        //   res.download(`F:/testredis/public/1.txt`);
        // }else{
        //   res.send('错误的请求');
        // }
        res.download('upload/logo-1508833808696.png');
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



    app.get('/wx/qrcode', weixinserver.qrcode);

    app.post('/login', function (req, res, next) {

        next();
    });

    app.use('/scheme',require("../app/controllers/scheme"));
    app.use('/manager',require("../app/controllers/manager"));
    app.use('/equipment',require("../app/controllers/equipment"));
    app.use('/project',require("../app/controllers/project"));
    app.use('/design',require("../app/controllers/design"));

    app.use(function (err, req, res, next) {
        if (err.message
            && (~err.message.indexOf('not found')
                || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        res.status(500).render('500', { error: err.stack });
    });

    app.use(function (req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
};
