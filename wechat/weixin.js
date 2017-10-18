const getToken = require('./websdk/getWebToken');
const getQrcode = require('./websdk/getWebQrcode');
const getUserInfo = require('./websdk/getWebUserInfo');
const getQrticket=require('./websdk/getWebQrticket');

exports.userinfo = function (req, res, next) {
    getToken(req.query.code)
        .then(function (data) {
            console.log("log:" + data);
            return JSON.parse(data);
        })
        .then(function (data) {
            getUserInfo(data['access_token'], data['openid']).then(_ => {
                console.log("test:"+_);
                var userinfo=JSON.parse(_);
                var nickname = userinfo.nickname;
                var openid = userinfo.openid;
                var sex = userinfo.sex;
                var city = userinfo.city;
                var headimageurl = userinfo.headimageurl;
                var weixin = {
                    openid: openid,
                    nickname: nickname,
                    sex: sex,
                    city: city,
                    headimageurl: headimageurl
                };
                req.session.weixin = weixin;
                console.log("set" + req.session.weixin);
                next();
                //res.render('home/user.ejs', {userinfo: _});      
            })
        });
};

exports.qrcode = function (req, res) {
    const config = require('../config.json');
    const wechat = require('../wechat/wechat');
    var wechatApp = new wechat(config); 
    wechatApp.getAccessToken()
    .then(function (data) {
			return data;
        })
	.then(function (data) {
			var scenid=req.query.scenid;
            getQrcode(req,data, scenid)
			.then(_ =>{
                console.log("a:"+_);
				let ticketvalue=JSON.parse(_);
				let imageurl='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ticketvalue.ticket;
				res.write(imageurl);
				res.end();
			});
	});
};
    
