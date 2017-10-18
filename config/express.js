
/**
 * 框架模块
 */

//express模块
var express = require('express');
//设置session
var session = require('express-session');
//创建连接刷新中间件
var flash = require('connect-flash');
//构建当前的压缩模块
var compression = require('compression');
//日志中间件
var morgan = require('morgan');
//cookie中间件
var cookieParser = require('cookie-parser');
//数据转换中间件
var bodyParser = require('body-parser');
//方法重写中间件
var methodOverride = require('method-override');

var helpers = require('view-helpers');
//ejs模块
var ejs = require('ejs');

var pkg = require('../package.json');

/**构造函数，当前程序的输出*/
module.exports = function (app) {

    // 启动当前程序的压缩
    app.use(compression({
        threshold: 512
    }));


    // 设置视图模板引擎
    app.set('views', "App/views");
    app.set('view engine', 'ejs');




    // 进行Url转换
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    //进行JSON转换
    app.use(bodyParser.json());

    //进行方法覆盖
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // Post方法获取
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    //应用当前的cookie中间件
    app.use(cookieParser("cdo"));

    //设置Session
    app.use(session({
        secret: 'cdo',
        resave: true,
        saveUninitialized: true
    }));
    app.use(flash());
    app.use(helpers(pkg.name));

    // 设置当前包文件和环境信息
    app.use(function (req, res, next) {

        res.locals.pkg = pkg;
        next();
    });
};
