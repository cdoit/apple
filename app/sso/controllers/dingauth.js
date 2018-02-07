var express = require('express');
var querystring = require('querystring');
var cdohttps = require('../../uitl/cdohttps');
var accessTokenJson = require('../access_token');//引入本地存储的 access_token
var fs = require('fs'); //引入 fs 模块
var config=require('../config');

class dingauth
{
    constructor()
    {

    }

    getaccesstokan()
    {
        return new Promise(function(resolve,reject){
            var currentTime = new Date().getTime();
            //判断 本地存储的 access_token 是否有效
            console.log(config.corpid);
            if(accessTokenJson.access_token == "" || accessTokenJson.expires_time < currentTime){
                var path = 'https://oapi.dingtalk.com/gettoken?' + querystring.stringify({
                corpid: config.corpid,
                corpsecret: config.corpsecret});
                new cdohttps().requestGet(path).then(function(data){
                    var result = JSON.parse(data);
                    
                    // req.session.token = obj.access_token;
                    // res.json(data);
                    if(data.indexOf("errcode") == 0){
                        console.log("tk:"+result.access_token);
                        accessTokenJson.access_token = result.access_token;
                        accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                        //更新本地存储的
                        fs.writeFile('../access_token.json',JSON.stringify(accessTokenJson));
                        //将获取后的 access_token 返回
                        resolve(accessTokenJson.access_token);
                    }else{
                        console.log("tk:"+data.indexOf("errcode"));
                        //将错误返回
                        reject(result);
                    } 
                });
            }else{
                //将本地存储的 access_token 返回
                resolve(accessTokenJson.access_token);  
            }
        });
    }
}

module.exports = dingauth;

