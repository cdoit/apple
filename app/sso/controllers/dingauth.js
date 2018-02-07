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
            if(accessTokenJson.access_token == "" || accessTokenJson.expires_time < currentTime){
                var path = 'https://oapi.dingtalk.com/gettoken?' + querystring.stringify({
                corpid: config.corpid,
                corpsecret: config.corpsecret});
                new cdohttps().requestGet(path).then(function(data){
                    var result = JSON.parse(data);
                    if(result.errcode == 0){
                        accessTokenJson.access_token = result.access_token;
                        accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                        //更新本地存储的

                        fs.writeFile('./app/soo/access_token.json',JSON.stringify(accessTokenJson));
                        console.log("write");
                        //将获取后的 access_token 返回
                        resolve(accessTokenJson.access_token);
                    }else{
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

