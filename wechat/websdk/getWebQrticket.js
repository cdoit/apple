'use strict';
const request = require('request');
const qs = require('querystring');

function getQrticket(Ticket) {
   let url='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+Ticket;
   return url;
  //  let options = {
  //   method: 'get',
  //   url: url
  //  };
  // console.log(url);
  // return new Promise((resolve, reject) => {
  //   request(options, function (err, res, body) {
  //     if (res) {
  //     console.log(body);
    
  //       resolve(body);
  //     } else {
  //       reject(err);
  //     }
  //   })
  // })
  
}


module.exports = getQrticket;