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
    app.get('/testgetserver', function (req, res) {
        home.testgetserver(req, res);
    });
    //
    app.get('/wx', function (req, res) {
        wechatApp.auth(req, res);
    });

    //
    app.post('/wx', function (req, res) {
        wechatApp.handleMsg(req, res);
    });

    //
    app.get('/getAccessToken', function (req, res) {
        wechatApp.getAccessToken().then(function (data) {
            res.send(data);
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

    app.get('/wx/test', getopenid, function (req, res, next) {


        webchatTest.add(req.session.openid);
    });

    app.get('/wx/marketingregister', weixinserver.userinfo, function (req, res, next) {
        
                var weixin = req.session.weixin;
        
                console.log("get1", weixin);
        
                db.User.findOne({
                    where: {
                        openid: weixin.openid
                    }
                }).then(function (result) {
                    if (result) {
                        req.session.user = result;
                    } 
                    res.redirect("/index.html");
                });
        
            });


    app.get('/wx/userinfo', weixinserver.userinfo, function (req, res, next) {

        var weixin = req.session.weixin;

        console.log("get1", weixin);

        db.User.findOne({
            where: {
                openid: weixin.openid
            }
        }).then(function (result) {
            if (result) {
                //
                req.session.user = result;

                if (result.mobile) {
                    res.redirect('/user');
                } else {
                    console.log("find a person bu no register");
                    if (result.roleid == 0) {
                        res.redirect("/register.html");
                    } else {
                        res.redirect("/SaleRegister.html");
                    }
             
                }
          
            } else {
                console.log("find no person");
                res.redirect("/register.html");
            }
        });

    });
    //
    app.get('/user', function (req, res, next) {
        var user = req.session.user;
  
        if (user != null) {
            db.User.findOne({
                where: {
                    openid: user.openid
                }
            }).then(function (result) {
                if (result.roleid == 0) {
                    res.redirect("/registerEnd.html");
                } else {
                    res.render('home/salesperson.ejs', { user: result });
                }
            });
        } else {
            res.redirect("/register.html");
        }
    });

    //
    app.get('/user/my', function (req, res, next) {
        var user = req.session.user;

        if (user != undefined) {

            db.Sequelize.query("select * from user as u1  join userinfo as u2 on u1.id=u2.user_id where u1.id='" + user.id+"'").then(function (fuser) {

                var userf = fuser[0][0];

                db.Sequelize.query("select * from user as u1  join userinfo as u2 on u1.id = u2.user_id where u1.sponsor='"+user.id+"'").then(function (sponsors) {

                    res.render('home/user.ejs', { user: userf, sponsors: sponsors[0]});

                });


            });
       
       
        } else {

          res.redirect("/register.html");
        }

    });
    //
    app.get('/user/orcode', function (req, res, next) {

        var user = req.session.user;
        
        if (user != undefined) {
            console.log("jj:"+user.id);
            http.get('http://www.faruxue1688.com/wx/qrcode?scenid=' + user.id, function (result) {
                console.log("imgreq:"+'http://www.faruxue1688.com/wx/qrcode?scenid=' + user.id);
                var html = '';
                result.on('data', function (data) {
                    console.log("imgurl:"+data);
                    html += data;
                    
                    res.render('home/orcode.ejs', { res: html });
                });
                result.on('end', function (html) {
                    console.info("creare or code");
                });
            });
        } else {
            http.get('http://www.faruxue1688.com/wx/qrcode?scenid=11', function (result) {

                var html = '';
                result.on('data', function (data) {
                    html += data;

                    res.render('home/orcode.ejs', { res: html });
                });
                result.on('end', function (html) {
                    console.info("creare or code");
                });
   
            });
        }
    });

    app.get('/wx/qrcode', weixinserver.qrcode);

    app.post('/login', function (req, res, next) {

        next();
    });

    app.post('/register', function (req, res, next) {
        var username = req.body.username;
        var address = req.body.address;
        var mobile = req.body.mobile;
        var code = req.body.code;
        var weixin = req.session.weixin;
        var user = null;
        var userinfo = null;
       
        if (weixin) {

    
            user = {
                mobile: mobile,
                openid: weixin.openid,
                active: true,
            };
     
            db.User.findOne({
                where: {
                    openid: weixin.openid
                }
            }).then(function (result) {
                if (result != null) {


                    if (result.mobile!=null&&result.mobile != "") {
                        var cuser = result;
                        req.session.user = cuser;
                        console.log("user存入日志1："+req.session.user);
                        res.redirect('/user');
                    } else {

              
    
                    userinfo = {
                        id:uuid.v1(),
                        username: username,
                        address: address,
                        userId: result.id,
                        loginIp:'127.0.0.1'
                    };
                    Promise.all([
                        db.User.update(user, { where: { openid: weixin.openid} }),
                        db.UserInfo.create(userinfo)
                    ]).then(function (udata) {
                        var user = result;
                        req.session.user = user;
                        req.session.userInfo = userinfo;
                        console.log("user存入日志2："+req.session.user);
                        console.log("userInfo存入日志2："+req.session.userInfo);
                        console.log("create success and go to registerEnd"+user.roleid);
                        // res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx459b286ba935a855&redirect_uri=http://www.faruxue1688.com/wx/userinfo&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect");
                        // if(user.roleid == 1){
                        //     //销售
                        //     console.log("销售+++++++："+user.roleid);
                        //     // res.render('home/salesperson', { user: result });
                            
                        //     res.render('home/salesperson.ejs', { user: result });
                        //     // res.redirect('/salesperson');
                        //     console.log("销售跳转了");
                        // }else{
                        //     console.log("用户+++++++："+user.roleid);
                        //     res.redirect('/user');
                        //     console.log("用户跳转了");
                        // }


                        res.write(user.roleid+"");
                        console.log("user.roleid的值："+user.roleid);
                        res.end();
                        console.log("走完+++++++：zzzzz");
                        }).catch(function (e) {
                            // return res.redirect('/register.html');
                            console.log(e);
                            next(e);
                        });

                    }
                };
                });

  
        } else {
            user = {
                mobile: mobile,
                active: true,
            };
            userinfo = {
                username: username,
                address: address,
            };

            Promise.all([
                db.User.create(user),
                db.UserInfo.create(userinfo),
            ]).then(function (result) {
                var user = result[0];
                req.session.user = user;
                console.log("create success and go to registerEnd");
                
                res.redirect('/user');
                console.log("标记：");
            }).catch(function (e) {
                return res.redirect('/register.html');
                next(e);
            });
        }

   

    });
    app.use('/test',require("../app/controllers/testdata"));
    app.use('/manager',require("../app/controllers/manager"));
    app.use('/pano',require("../app/controllers/pano"));
    app.use('/product',require("../app/controllers/product"));
    app.use('/search',require("../app/controllers/search"));
    app.use('/scheme',require("../app/controllers/scheme"));

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
