var express = require('express');
var login = require('./login');
var router = express.Router();
const db = require("../../db/");
var uuid = require('node-uuid');
var http = require('http');

router.get('', function (req, res) {
    var build={
        id:uuid.v1(),
        name: '天祥'
    }
    db.Building.create(build).then(function (result) {
        var department={
            id:uuid.v1(),
            buildingId: result.id,
            roomcount: 3
        }
        db.ApartmentLayout.create(department).then(function (result) {
            var product={
                id:uuid.v1(),
                apartmentLayoutId:result.id
            }
            db.Product.create(product).then(function (result) {
                var pano={
                    id:uuid.v1(),
                    imgtype: '1',
                    imgurl: "1",
                    category:"加建后",
                    productId:result.id
                }
                db.Panorama.create(pano).then(function (result) {
            
                    res.write("test data is ok");
                    res.end();
                });
            });
    
        });
    });
})


router.get('/user', function (req, res) {
//user
var role = {
    id:uuid.v1(),
    roletype: 'consumer',
    rolename:'普通用户'
};

db.Role.create(role).then(function (result) {
    var user = {
        id:uuid.v1(),
        username: "123",
        password:"123",
        mobile: "123",
        openid: "ss",
        roleId:result.id
    }
    db.User.create(user).then(function (result) {
        var userInfodata = {
            id:uuid.v1(),
            username:"uu",
            loginIp: '127.0.0.1'
        }
        var userInfo = db.UserInfo.build(userInfodata);
        result.setUserInfo(userInfo);
        res.write("user data is ok");
        res.end();
    });
});
})

router.get('/ad', function (req, res) {	
            //ad    province


var ad = {
    id:uuid.v1(),
    name:"uu",
    url: 'www.baidu.com',
    priority:'2'
}
db.Ad.create(ad).then(function (result) {
    //province
    var province = {
        id:uuid.v1(),
        provincename: "湖北省",
        provinceid:"420000"
    }
    db.Province.create(province).then(function (result) {
        var city = {
            id:uuid.v1(),
            cityname: "武汉市",
            cityid:"420100",
            fatherid:result.provinceid
        }
        db.City.create(city).then(function (result) {
            res.write(" data is ok");
            res.end();
        });

    });
});
})



router.get('/order', function (req, res) {	

var admin={
    id:"11",
    adminname:"admin",
    password:"admin",
    lastfailip:"127",
    roleId:11
}

db.AdminInfo.create(admin).then(function (result) {
    if(result!=null)
    {

    }
})

//order
var userIds;
var productIds;
db.User.findAll().then(function (result) {
    userIds = result[0].id;
}).then(function (data) {
    db.Product.findOne().then(function (aaa) {
        productIds = aaa.id;
    }).then(function (ee) {
        var order = {
            id:uuid.v1(),
            productId:productIds,
            userId:userIds,
            priority:'2'
        }
        db.Order.create(order).then(function (bbb) {
            var comment = {
                id:uuid.v1(),
                pralsecounts:"3",
                comment:"评论",
                productId:productIds,
                orderId:bbb.id
            }
            db.Comment_.create(comment).then(function (www) {
                //constructplans
                var constructplans = [{
                    id:uuid.v1(),
                    imgtype: "original",
                    imgurl:"11",
                    orderId:www.orderId
                },
                {
                    id:uuid.v1(),
                    imgtype: "record",
                    imgurl:"2112",
                    orderId:www.orderId
                },  
                {
                    id:uuid.v1(),
                    imgtype: "result",
                    imgurl:"333",
                    orderId:www.orderId
                }];

                db.Constructplans.bulkCreate(constructplans).then(function (result) {
                    res.write("test data is ok");
                    res.end();
                });
            })
        });
    });
});
}) 


router.get('/historysearch', function (req, res) {	
    
//historysearch
var userIds;
var buildingIds;
db.User.findOne().then(function (result) {
    userIds = result.id;
}).then(function (data) {
    db.Building.findOne().then(function (aaa) {
        buildingIds = aaa.id;
    }).then(function (ee) {
        var historysearch = {
            id:uuid.v1(),
            buildingId:buildingIds,
            userId:userIds,
            searchCount:'2'
        }
        db.HistorySearch.create(historysearch).then(function (bbb) {
            res.write(" data is ok");
            res.end();
        });
    });
});
}) 


router.get('/testdata', function (req, res) {
   //test数据
    http.get('http://localhost:3000/test', function (result) {
        // console.log(result);
    });

    http.get('http://localhost:3000/test/user', function (result) {
        // console.log(result);
    });

    http.get('http://localhost:3000/test/ad', function (result) {
        // console.log(result);
    });

    http.get('http://localhost:3000/test/order', function (result) {
        // console.log(result);
    });

    http.get('http://localhost:3000/test/historysearch', function (result) {
        // console.log(result);
    });
}) 


module.exports = router;

