'use strict';
const request = require('request');
const qs = require('querystring');
var url = require('url');
var https = require('https');
var util = require('util');

function getQrcode(req,AccessToken,scenid) {
    let urlGetTicket =  'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token='+AccessToken;
    let post_data ="{\"action_name\":\"QR_LIMIT_SCENE\",\"action_info\":{\"scene\":{\"scene_id\":"+scenid+"}}}";
    return new Promise((resolve, reject) => {
      post(urlGetTicket,post_data, function (body) {
        if (body) {
          resolve(body);
        } else {
          reject("null");
        }
      })
    })
    req.write(post_option);
    req.end();
}


function post(url,data,fn){
    data=data||{};
    var content=data;//require('querystring').stringify(data);
    var parse_u=require('url').parse(url,true);
    var isHttp=parse_u.protocol=='http:';
    var options={
          host:parse_u.hostname,
          port:parse_u.port||(isHttp?80:443),
          path:parse_u.path,
          method:'POST',
          headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-Length':content.length
          }
      };
      var req = require(isHttp?'http':'https').request(options,function(res){
        var _data='';
        res.on('data', function(chunk){
            _data += chunk;
        });
        res.on('end', function(){
              fn!=undefined && fn(_data);
          });
      });
      req.write(content);
      req.end();
}

module.exports = getQrcode;