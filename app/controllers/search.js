var express = require('express');
var login = require('./login');
var router = express.Router();
const db = require("../db/");
var uuid = require('node-uuid');

router.get('/www', function (req, res) {
    var build=null;
    var buildname=req.query.buildname;
    var filter = {
        where: {
            name:buildname
        }
    }
    db.Building.findAll(filter).then(function (data) {
        if(data==null||data.length=='0')
        {
            res.render('common/listview',{build:null});
        }
        else
        {
            build=data;
            return data;
        }
    })
    .then(function (builds)
    {   
        var build=builds[0];
        db.ApartmentLayout.findAll({ buildingId:build.id }).then(function (layouts) 
        {
            if(layouts==null||layouts.length=='0')
            {
                build.products=[];
                res.render('common/search',{build:build});
            }
            else
            {
                layerids=[];
                for(var i=0;i<layouts.length;i++)
                {
                    layerids.push(layouts[i].id);
                }
                db.Product.findAll({apartmentLayoutId:layerids}).then(function (products)
                {
                    if(products==null||products.length=='0')
                    {
                        res.render('common/listview',{build:build});
                    }
                    else
                    {
                        build.products=products;
                        res.render('common/listview',{build:build});
                    }
                })
            }
        })
    })
    .catch(function(erorr )
    {
        res.render('common/listview',{build:null});
    });
})



router.get('', function (req, res) {
    var buildname=req.query.buildname;
    if(buildname == null || buildname == undefined){
        buildname = '';
    }
    db.Sequelize.query(
        // "select b.id,b.`name`,b.address,a.id as apartmentLayoutId,p.id as productId from building as b LEFT JOIN apartmentLayout as a on a.building_id = b.id "+
        // " LEFT JOIN product as p on a.id = p.apartmentLayout_id  where b.`name` LIKE '%"+buildname+"%'"
        "select b.id,b.`name`,b.address from building as b where b.`name` LIKE '%"+buildname+"%'"
    ).then(function (data) {
        var builds = data[0];
        //暂时屏蔽
        // if(builds!=null && builds.length > '0'){
        //     var count = '0';
        //     //意味着搜索成功，向HistorySearch中插数据
        //     for (var index = 0; index < builds.length; index++) {
        //         var historySearch={
        //             where: {
        //                 userId: 'fe222960-9865-11e7-b4c0-4d616e501f58',
        //                 buildingId:builds[index].id
        //             }
        //         };
        //         db.HistorySearch.findAll(historySearch).then(function (data) {
        //             if(data!=null&&data.length!='0'){
        //                 db.HistorySearch.update(
        //                     {'searchCount': data[0].searchCount+1},
        //                     {
        //                         'where': {
        //                             'id': data[0].id
        //                         }
        //                     }
        //                 );
        //             }else{
        //                 var creat={
        //                     id:uuid.v1(),
        //                     userId: 'fe222960-9865-11e7-b4c0-4d616e501f58',
        //                     buildingId:builds[index].id,
        //                     searchCount:1
        //                 };
        //                 db.HistorySearch.create(creat);
        //             }
        //         });
        //     }
        // }
        res.render('common/listview',{build:builds,buildname:buildname});
    });
    
});

module.exports = router;