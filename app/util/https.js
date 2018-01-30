var https = require("https");
var express = require('express');
var oapiHost = 'oapi.dingtalk.com';

module.exports = {
  get: function(path, res) {
    https.get('https://'+path, function(response) {
      console.log('three:'+'https://'+path);
      if (response.statusCode === 200) {
        var body = '';  
        response.on('data', function (data) {
          body += data; 
        }).on('end', function () { 
          var result = JSON.parse(body);
          if (result && 0 === result.errcode) {
            backres.json(result);
          }
          else {
            var err={"status":"0","msg":result.errcode};
            backres.json(err);
          }
        });  
      }
      else {
        backres.error(response.statusCode);
      }
    });
  },

  post: function(path, data, cb) {
    var opt = {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      host: oapiHost,  
      path: path,  
    };
    var req = https.request(opt, function (response) {
      if (response.statusCode === 200) {  
        var body = '';  
        response.on('data', function (data) {
          body += data; 
        }).on('end', function () { 
          var result = JSON.parse(body);
          if (result && 0 === result.errcode) {
            cb.success(result);
          }
          else {
            cb.error(result);
          }
        });  
      }  
      else {
        cb.error(response.statusCode);  
      }  
    });  
    req.write(data + '\n');  
    req.end();  
  }
};