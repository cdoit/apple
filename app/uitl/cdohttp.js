http = require('http');//引入 htts 模块
var express = require('express');

class cdohttp
{
    constructor()
    {

    }

    requestGet(host,port,path){
        return new Promise(function(resolve,reject){
            const options = {
                hostname: host,
                port: port,
                path: path,
                method: 'GET'
            };
            
            const req = http.request(options, (res) => {
            console.log(`状态码: ${res.statusCode}`);
            console.log(`响应头: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            
            res.on('data', (chunk) => {
                console.log(`响应主体: ${chunk}`);
              
                resolve(chunk);
            });
            res.on('end', () => {
                console.log('响应中已无数据。');
            });
            });
            
            req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            });
            
            req.end();

        }).catch(function(error)
        {
    
        });
    }

    /**
     * 用于处理 https Post请求方法
     * @param {String} url  请求地址
     * @param {JSON} data 提交的数据
     */
    requestPost(host,port,path,data){
        return new Promise(function(resolve,reject){
            const options = {
                hostname: host,
                port: 80,
                path: path,
                method: 'POST'
            };
            
            const req = http.request(options, (res) => {
            console.log(`状态码: ${res.statusCode}`);
            console.log(`响应头: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            html='';
            res.on('data', (chunk) => {
                console.log(`响应主体: ${chunk}`);
                html+=chunk;
                resolve(html);
            });
            res.on('end', () => {
                console.log('响应中已无数据。');
            });
            });
            
            req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            });
            
            // 写入数据到请求主体
            req.write(data);
            req.end();

        }).catch(function(error)
        {
    
        });
    }
}
module.exports = cdohttp;