var express = require('express');
var login = require('./login');
var router = express.Router();
const db = require("../../db/");
var uuid = require('node-uuid');

router.get('', function (req, res) {
    var productid = req.query.productid;
    var filter = {
        where: {
            product_id: productid
        }
    }
    db.Product.find(filter).then(function (result) {

        res.render('manager/index.ejs', { users: result });
    });
})




//首页
router.get("/index", function (req, res, next) {
    var filter = {
        attributes: [
            'name',['imgurl', 'url']
        ]
    };

    Promise.all([
        //product
        db.Sequelize.query(
            "SELECT p.id as productId, p.apartmentLayout_id as subId, p.`name` as title, p.loopimags as img, p.category,  p.area as original_size, p.targetsize as target_size,p.constructtime ,p.price ,a.roomcount,a.floorheight,a.hallcount,a.kitchencount,a.wccount FROM product AS p JOIN apartmentLayout AS a ON p.apartmentLayout_id = a.id"
        ),
        //ad
        db.Ad.findAll(filter)
        ]).then(function(results){
        var obj = new Object;
        obj.products = results[0][0];
        obj.slogans = results[1];
        // res.json(obj);
        res.render('wx/views/common/produce', {ad: obj});
      }).catch(next);

});

//根据楼盘获取户型和产品
router.get("/queryBybuildingId", function (req, res, next) {
    var buildingId = req.query.buildingId;
    var buildingname = req.query.name;
    //可不传
    var apartmentLayoutId = req.query.apartmentLayoutId;
    var layoutCon = {
        where: {
            buildingId:buildingId
        },
        attributes: [
            'name','id','buildingId'
        ]
    };

    var obj = new Object;
    db.ApartmentLayout.findAll(layoutCon).then(function (resultLayout) {
        obj.apartment = resultLayout;
        obj.buildingId = buildingId;
        //如果apartmentLayoutId为空，取第一个户型id
        if(apartmentLayoutId == undefined || apartmentLayoutId == null){
            apartmentLayoutId = resultLayout.length!='0'? resultLayout[0].id:"";
        }
        obj.apartmentLayoutId = apartmentLayoutId;
        var productCon = {
            where: {
                apartmentLayoutId:apartmentLayoutId
            }
        };
        db.Product.findAll(productCon).then(function (resultProduct) {
            obj.product = resultProduct;
            // res.json(obj);
            res.render('common/attention', {buildings: obj,buildingname:buildingname});
            });
        }).catch(next);
});


//
router.get('/product', function (req, res, next) {
    var productId = req.query.productId;

    Promise.all([
        //product
        db.Sequelize.query("select p.*,p.id as productId,a.* from product as p  join apartmentLayout as a on p.apartmentLayout_id = a.id where p.id='"+productId+"'"),
        //order
        db.Sequelize.query(
            "SELECT u.id as userId,o.id as projectId,ui.username   FROM `order` as o LEFT JOIN `user` as u on o.user_id = u.id " +
            " LEFT JOIN userinfo as ui on ui.user_id = u.id WHERE o.product_id = '"+productId+"'"
        ),
        //comment
        db.Sequelize.query(
            "SELECT u.id as userId,c.order_id as projectId,ui.username,c.`comment` as remark,c.pralsecounts as rating FROM `comment` as c " +
            " LEFT JOIN `user` as u on c.user_id = u.id LEFT JOIN userinfo as ui on ui.user_id = u.id WHERE c.product_id = '"+productId+"'"
        )
        ]).then(function(results){
        var obj = new Object;
        obj.product = results[0][0][0];
        obj.purchaser = results[1][0];
        obj.comment = results[2][0];
        // res.json(obj);
        res.render('wx/views/common/single', {single: obj});
      }).catch(next);
});





// 施工过程记录（原始图）
router.get("/process", function (req, res, next) {
    var projectId = req.query.projectId;
    // var userId = req.query.userId;
    var user = req.session.user;
    var userId = user!=null && user!=undefined ? user.id : '';
    var constplansObj = new Object;
    constplansObj.projectId = projectId;
    constplansObj.userId = userId;
    constplansObj.tyle = 'original';
    var original = {
        where: {
            orderId:projectId,
            imgtype:'original'
        },
        attributes: [
            'imgurl'
        ]
    };

    var record = {
        where: {
            orderId:projectId
        },
        attributes: [
            'content',['imgurl', 'images'],['id', 'recordId']
        ]
    };

    var result = {
        where: {
            orderId:projectId,
            imgtype:'result'
        },
        attributes: [
            'imgurl'
        ]
    };
    
    Promise.all([
        db.Constructplans.findAll(original),
        db.Constructrecord.findAll(record),
        db.Constructplans.findAll(result)
        ]).then(function(results){
        constplansObj.original = results[0];
        constplansObj.record = results[1];
        constplansObj.result = results[2];
        // res.json(constplansObj);
        res.render('common/process', {process: constplansObj});
      }).catch(next);

});



// 施工过程记录（结果图）
router.get("/result", function (req, res, next) {
    var projectId = req.query.projectId;
    // var userId = req.query.userId;
    var user = req.session.user;
    var userId = user!=null && user!=undefined ? user.id : '';
    var constplansObj = new Object;
    constplansObj.projectId = projectId;
    constplansObj.userId = userId;
    constplansObj.tyle = 'result';

    var result = {
        where: {
            orderId:projectId,
            imgtype:'result'
        },
        attributes: [
            'imgurl'
        ]
    };
    
    db.Constructplans.findAll(result).then(function (resultPlans) {
        constplansObj.original = resultPlans;
        // res.json(constplansObj);
        res.render('common/process', {process: constplansObj});
    }).catch(next);
});



// 施工过程记录（过程图）
router.get("/record", function (req, res, next) {
    var projectId = req.query.projectId;
    // var userId = req.query.userId;
    var user = req.session.user;
    var userId = user!=null && user!=undefined ? user.id : '';
    var constplansObj = new Object;
    constplansObj.projectId = projectId;
    constplansObj.userId = userId;
    constplansObj.tyle = 'record';

    var record = {
        where: {
            orderId:projectId
        },
        attributes: [
            'content','imgurl',['id', 'recordId']
        ]
    };
    db.Constructrecord.findAll(record).then(function (recordPlans) {
            constplansObj.original = recordPlans;
            // res.json(constplansObj);
            res.render('common/process', {process: constplansObj});
    }).catch(next);

});


//对当前项目的评论
router.get("/comment", function (req, res, next) {
    var projectId = req.query.projectId;
    // var userId = req.query.userId;
    var user = req.session.user;
    var userId = user!=null && user!=undefined ? user.id : '';
    var commentObj = new Object;
    commentObj.projectId = projectId;
    commentObj.userId = userId;
    var comFilter = {
        where: {
            orderId:projectId
        }
        // ,
        // attributes: [
        //     ['pralsecounts', 'rating'],['comment', 'remark']
        // ]
    };

    var filter = {
        where: {
            orderId:projectId,
            imgtype:'result'
        },
        attributes: [
            'imgurl'
        ]
    };

    Promise.all([
        db.Comment_.findAll(comFilter),
        db.Constructplans.findAll(filter)
        ]).then(function(results){
        commentObj.rating = results[0][0].pralsecounts;
        commentObj.remark = results[0][0].comment;
        commentObj.imgs = results[1];
        // res.json(commentObj);
        res.render('common/commit', {commit: commentObj});
      }).catch(next);

});

router.get("/animation", function (req, res, next) {
    //获取产品id
    var productId = req.query.productId;
    //获取产品施工动画（photo表）
    var filter = {
        where: {
            productId:productId
        },
        attributes: [
            'imgurl'
        ]
    }
    db.Photo.findAll(filter).then(function (result) {
        // res.json(result);
        res.render('common/animation', { animation: result });
    }).catch(next);
});

module.exports = router;