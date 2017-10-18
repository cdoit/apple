'use strict' //设置为严格模式

var uuid = require('node-uuid'); 
const crypto = require('crypto'), //引入加密模块
       https = require('https'), //引入 htts 模块
        util = require('util'), //引入 util 工具包
          fs = require('fs'), //引入 fs 模块
      urltil = require('url'),//引入 url 模块
accessTokenJson = require('./access_token'), //引入本地存储的 access_token
      menus  = require('./menus'), //引入微信菜单配置
 parseString = require('xml2js').parseString,//引入xml2js包
         msg = require('./msg'),//引入消息处理模块
         CryptoGraphy = require('./cryptoGraphy'); //微信消息加解密模块

const db = require("../app/db/");
/**
 * 构建 WeChat 对象 即 js中 函数就是对象
 * @param {JSON} config 微信配置文件 
 */
var WeChat = function (config) {
    //设置 WeChat 对象属性 config
    this.config = config;
    //设置 WeChat 对象属性 token
    this.token = config.token;
    //设置 WeChat 对象属性 appID
    this.appID = config.appID;
    //设置 WeChat 对象属性 appScrect
    this.appScrect = config.appScrect;
    //设置 WeChat 对象属性 apiDomain
    this.apiDomain = config.apiDomain;
    //设置 WeChat 对象属性 apiURL
    this.apiURL = config.apiURL;

    /**
     * 用于处理 https Get请求方法
     * @param {String} url 请求地址 
     */
    this.requestGet = function(url){
        return new Promise(function(resolve,reject){
            https.get(url,function(res){
                var buffer = [],result = "";
                //监听 data 事件
                res.on('data',function(data){
                    buffer.push(data);
                });
                //监听 数据传输完成事件
                res.on('end',function(){
                    result = Buffer.concat(buffer).toString('utf-8');
                    //将最后结果返回
                    resolve(result);
                });
            }).on('error',function(err){
                reject(err);
            });
        });
    }

    /**
     * 用于处理 https Post请求方法
     * @param {String} url  请求地址
     * @param {JSON} data 提交的数据
     */
    this.requestPost = function(url,data){
        return new Promise(function(resolve,reject){
            //解析 url 地址
            var urlData = urltil.parse(url);
            //设置 https.request  options 传入的参数对象
            var options={
                //目标主机地址
                hostname: urlData.hostname, 
                //目标地址 
                path: urlData.path,
                //请求方法
                method: 'POST',
                //头部协议
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data,'utf-8')
                }
            };
            var req = https.request(options,function(res){
                var buffer = [],result = '';
                //用于监听 data 事件 接收数据
                res.on('data',function(data){
                    buffer.push(data);
                });
                 //用于监听 end 事件 完成数据的接收
                res.on('end',function(){
                    result = Buffer.concat(buffer).toString('utf-8');
                    resolve(result);
                })
            })
            //监听错误事件
            .on('error',function(err){
                console.log(err);
                reject(err);
            });
            //传入数据
            req.write(data);
            req.end();
        });
    }
}

/**
 * 微信接入验证
 * @param {Request} req Request 对象
 * @param {Response} res Response 对象
 */
WeChat.prototype.auth = function(req,res){

		var that = this;
		this.getAccessToken().then(function(data){
			//格式化请求连接
			var url = util.format(that.apiURL.createMenu,that.apiDomain,data);
            //使用 Post 请求创建微信菜单
            //menus.button[2].name = "我的2";
			that.requestPost(url,JSON.stringify(menus)).then(function(data){
				//讲结果打印
				console.log(data);
			});
		});

        //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
        var signature = req.query.signature,//微信加密签名
            timestamp = req.query.timestamp,//时间戳
                nonce = req.query.nonce,//随机数
            echostr = req.query.echostr;//随机字符串

        //2.将token、timestamp、nonce三个参数进行字典序排序
        var array = [this.token,timestamp,nonce];
        array.sort();

        //3.将三个参数字符串拼接成一个字符串进行sha1加密
        var tempStr = array.join('');
        const hashCode = crypto.createHash('sha1'); //创建加密类型 
        var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密

        //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if(resultCode === signature){
            res.send(echostr);
        }else{
            res.send('mismatch');
        }
}

/**
 * 获取微信 access_token
 */
WeChat.prototype.getAccessToken = function(){
    var that = this;
    return new Promise(function(resolve,reject){
        //获取当前时间 
        var currentTime = new Date().getTime();
        //格式化请求地址
        var url = util.format(that.apiURL.accessTokenApi,that.apiDomain,that.appID,that.appScrect);
        //判断 本地存储的 access_token 是否有效
        if(accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime){
            that.requestGet(url).then(function(data){
                var result = JSON.parse(data); 
                if(data.indexOf("errcode") < 0){
                    accessTokenJson.access_token = result.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    //更新本地存储的
                    fs.writeFile('./wechat/access_token.json',JSON.stringify(accessTokenJson));
                    //将获取后的 access_token 返回
                    resolve(accessTokenJson.access_token);
                }else{
                    //将错误返回
                    resolve(result);
                } 
            });
        }else{
            //将本地存储的 access_token 返回
            resolve(accessTokenJson.access_token);  
        }
    });
}

/**
 * 微信消息处理
 * @param {Request} req Request 对象
 * @param {Response} res Response 对象
 */
WeChat.prototype.handleMsg = function(req,res){
    var buffer = [],that = this;

    //实例微信消息加解密
    var cryptoGraphy = new CryptoGraphy(that.config,req);

    //监听 data 事件 用于接收数据
    req.on('data',function(data){
        buffer.push(data);
    });
    //监听 end 事件 用于处理接收完成的数据
    req.on('end',function(){
        var msgXml = Buffer.concat(buffer).toString('utf-8');
        //解析xml
        parseString(msgXml,{explicitArray : false},function(err,result){
            if(!err){
                result = result.xml;
                //判断消息加解密方式
                if(req.query.encrypt_type == 'aes'){
                    //对加密数据解密
                    result = cryptoGraphy.decryptMsg(result.Encrypt);
                }
                var toUser = result.ToUserName; //接收方微信
                var fromUser = result.FromUserName;//发送仿微信
                var reportMsg = ""; //声明回复消息的变量   

                //判断消息类型
                if(result.MsgType.toLowerCase() === "event"){
                    //判断事件类型
                    switch(result.Event.toLowerCase()){
                        case 'subscribe':
                            var contentArr = [
                                {Title:"叮当快建是提供专业楼板加建服务的网站",
                                Description:"在下方点击“我的”，申请免费量房，预约样板间和业务咨询",
                                PicUrl:"http://www.faruxue1688.com/images/Abuild.jpg",
                                Url:"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx459b286ba935a855&redirect_uri=http://www.faruxue1688.com/wx/marketingregister&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect"},
                            ];
                            //回复图文消息
                            reportMsg = msg.graphicMsg(fromUser,toUser,contentArr);    
                            console.log("username:"+result.FromUserName);
                            console.log("evntkey:"+result.EventKey);
                            var rolekey = result.EventKey;
                            var raks = rolekey.split("_");
                            //当前账号的归属
                            var sponsor = parseInt(raks[1]);
                            var roleid = 0;
                            //当前归属为9527时，说明是销售
                            if (sponsor == 9527) {
                                //销售角色
                                roleid = 1;
                            }
                            //console.log(db);
                            //console.log(db.User);
                            // var u={
                            //     id:uuid.v1(),
                            //     openid: result.FromUserName,
                            //     roleid: roleid,
                            //     sponsor: sponsor,
                            //     active: true
                            // };
                            // console.log("create:");
                            // console.log(u);
                            db.User.findOne({
                                where: {
                                    openid: result.FromUserName
                                }
                            }).then(function (user) {
                                if (user == null) {
                                   db.User.create({
                                        openid: result.FromUserName,
                                        roleid: roleid,
                                        sponsor: sponsor,
                                        active: true
                                    });
                                }
                            });
                  

							// var contentArr = [
                            //     {Title:"叮当产品介绍",Description:"叮当快建是一个提供专业的楼板加建产品服务的网站",PicUrl:"http://www.faruxue1688.com/img/1.jpg",Url:"http://faruxue1688.com/index.html"},
                            // ];
                            // //回复图文消息
                            // reportMsg = msg.graphicMsg(fromUser,toUser,contentArr);
                            break;
                        case "SCAN":
                            
                            //要实现统计分析，则需要扫描事件写入数据库，这里可以记录 EventKey及用户OpenID，扫描时间
                            break;
                        case 'click':
                             var contentArr = [
                                {Title:"叮当快建是提供专业楼板加建服务的网站",
                                 Description:"在下方点击“我的”，申请免费量房，预约样板间和业务咨询",
                                 PicUrl:"http://www.faruxue1688.com/images/Abuild.jpg",
                                 Url:"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx459b286ba935a855&redirect_uri=http://www.faruxue1688.com/wx/marketingregister&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect"},
                            ];
                            //回复图文消息
                            reportMsg = msg.graphicMsg(fromUser,toUser,contentArr);
                            break;
                    }
                }else{
                     //判断消息类型为 文本消息
                    if(result.MsgType.toLowerCase() === "text"){
                        //根据消息内容返回消息信息
                        switch(result.Content){
                            case '1':
                                reportMsg = msg.txtMsg(fromUser,toUser,'Hello ！我是叮当');
                            break;
                            case '2':
                                reportMsg = msg.txtMsg(fromUser,toUser,'叮当快建是一个提供专业的楼板加建产品服务的网站');
                            break;
                            case '文章':
                                // var contentArr = [
								// 	{Title:"叮当产品介绍",Description:"叮当快建是一个提供专业的楼板加建产品服务的网站",PicUrl:"http://www.faruxue1688.com/img/a1.jpg",Url:"http://faruxue1688.com"},
                                // ];
                                // //回复图文消息
                                // reportMsg = msg.graphicMsg(fromUser,toUser,contentArr);
                                var content = "欢迎关注 叮当快建 公众号，叮当快建是一个提供专业的楼板加建产品服务的网站：\n";
                                content += "1.你是谁\n";
                                content += "2.关于Node.js\n";
                                content += "回复 “文章”  可以得到图文推送哦~\n";
                                content +=result.FromUserName+'\n';
                                content +=result.toUser+'\n';
                                content+=result.EventKey;

                             reportMsg = msg.txtMsg(fromUser,toUser,content);

                            break;
                            default:
                                reportMsg = msg.txtMsg(fromUser,toUser,"在下方点击“我的”，申请免费量房，预约样板间和业务咨询");
                            break;
                        }
                    }
                }
                //判断消息加解密方式，如果未加密则使用明文，对明文消息进行加密
                reportMsg = req.query.encrypt_type == 'aes' ? cryptoGraphy.encryptMsg(reportMsg) : reportMsg ;
                //返回给微信服务器
                res.send(reportMsg);

            }else{
                //打印错误
                console.log(err);
            }
        });
    });
}

//暴露可供外部访问的接口
module.exports = WeChat;