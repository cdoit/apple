'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../app/db/");
const config = require('../config.json')
const wechat = require('../app/wx/wechat/wechat');
var wechatApp = new wechat(config); 
const home = require('../app/wx/controllers/home');
const test = require('../app/wx/controllers/test');
var webchatTest = new test(db);
const login = require('../app/wx/controllers/login');
const weixinserver = require('../app/wx/wechat/weixin');
var http = require('http');
var admin = require('../app/wx/controllers/manager');

function getopenid(req, res, next) {
    req.session.openid = req.query.openid;
    next();
}

module.exports = function (app) {
    db.initwx();

    app.get('/wx', function (req, res) {
        wechatApp.auth(req, res);
    });
    //
    app.post('/wx', function (req, res) {
        wechatApp.handleMsg(req, res);
    });
    //
    app.get('/wx/getAccessToken', function (req, res) {
        wechatApp.getAccessToken().then(function (data) {
            res.send(data);
        });
    });
    //
    app.get("/wx/admin/show", function (req, res, next) {
        //
        db.User.findAll().then(function (users) {
            res.render('/wx/views/manager/userlist.ejs', { users: users });
        });
    });
    app.get("/wx/admin/edit", function (req, res, next) {
        //
        db.User.findAll().success(function (users) {
            res.render('/wx/views/home/userlist.ejs', { users: users });
        });
    });
    app.get("/wx/admin/delete", function (req, res, next) {
        var userid = req.query.userid;
        db.User.destroy({ where: { userid: userid } }).then(function (rowDeleted) {
            if (rowDeleted === 0) {
                res.redirect("wx/views/admin/show");
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
                    res.redirect("/webchat/index.html");
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
                    res.redirect('/wx/user');
                } else {
                    console.log("find a person bu no register");
                    if (result.roleid == 0) {
                        res.redirect("/webchat/register.html");
                    } else {
                        res.redirect("/webchat/SaleRegister.html");
                    }
             
                }
          
            } else {
                console.log("find no person");
                res.redirect("/webchat/register.html");
            }
        });

    });
    //
    app.get('/wx/user', function (req, res, next) {
        var user = req.session.user;
  
        if (user != null) {
            db.User.findOne({
                where: {
                    openid: user.openid
                }
            }).then(function (result) {
                if (result.roleid == 0) {
                    res.redirect("webchat/registerEnd.html");
                } else {
                    res.render('wx/views/home/salesperson.ejs', { user: result });
                }
            });
        } else {
            res.redirect("/webchat/register.html");
        }
    });

    //
    app.get('/wx/user/my', function (req, res, next) {
        var user = req.session.user;

        if (user != undefined) {

            db.Sequelize3.query("select * from user as u1  join userinfo as u2 on u1.id=u2.user_id where u1.id='" + user.id+"'").then(function (fuser) {

                var userf = fuser[0][0];

                db.Sequelize3.query("select * from user as u1  join userinfo as u2 on u1.id = u2.user_id where u1.sponsor='"+user.id+"'").then(function (sponsors) {

                    res.render('home/user.ejs', { user: userf, sponsors: sponsors[0]});

                });


            });
       
       
        } else {

          res.redirect("/webchat/register.html");
        }

    });
    //
    app.get('/wx/user/orcode', function (req, res, next) {
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

    app.post('/wx/login', function (req, res, next) {

        next();
    });

    app.post('/wx/register', function (req, res, next) {
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
                    } 
                    else 
                    {
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
                return res.redirect('webchat/register.html');
                next(e);
            });
        }
    });
    app.use('/wx/test',require("../app/wx/controllers/testdata"));
    app.use('/wx/manager',require("../app/wx/controllers/manager"));
    app.use('/wx/pano',require("../app/wx/controllers/pano"));
    app.use('/wx/product',require("../app/wx/controllers/product"));
    app.use('/wx/search',require("../app/wx/controllers/search"));
};
