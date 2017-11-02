var seneca = require('seneca');
var async = require('async'); 
/*
 * Module dependencies.
 */
exports.index = function (req, res) {
  res.render('home/index', {
      title: 'Node Express Mongoose Boilerplate'
    });
};

exports.getdata = function (req, res) {
    // data=require("../core/stock/xuqiu");
    var bookrep = require('../../microservice/user/userrespository');
    var content=bookrep.add({uniqueId:require('node-uuid').v1(),lastName: 'Hancock',firstName: 'John'},handler);
    if(content==true)
    {
      res.write("针对请求返回正确数据，请更新绑定的变量");
      res.end();
    }
    else
    {
      res.write("针对请求返回错误数据，请更新绑定的变量");
      res.end();
    }
    // seneca()
    // .client({port: 8270,type: 'net', pin: 'cmd:run'})
    // //.use(local)
    // .act('cmd:run', handler);
};

exports.getuser = function (req, res) {
  res.render('home/user', {
    userinfo: 'Node Express Mongoose Boilerplate'
    });

  
};

exports.testmicroservice = function (req, res) {
  return new Promise((resolve, reject) => {
    seneca()
    .client({port: 8000,type: 'tcp'})
    .act({
      role: 'math',
      cmd: 'sum',
      left: 1,
      right: 2
    }, (err, result) => {
      if (err) {
        return console.error(err);
      }
      else
      {
        res.write(JSON.stringify(result));
        res.end();
      }
    });
     
  })
};



