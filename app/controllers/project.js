var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");
var seneca = require('seneca');
var async = require('async');

//任务（项目）列表
router.get('/list', login.checkin, function (req, res, next) {
    var keyword = req.query.keyword;
    var pageNo = req.query.pageNo;
    var pageSize = req.query.pageSize;
    if(keyword ==  undefined || keyword == null || keyword == "undefined"){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),  //跳过多少条
                'where':{
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where':{
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/list.ejs', 
            {pageNo:pageNo,pageSize:pageSize,total:total,totalPage:totalPage,projectProgress:result[1],keyword:keyword, project: result[0] });
      }).catch(next);
});

router.post('/list', login.checkin, function (req, res, next) {
    var keyword = req.body.keyword;
    // var countPerPage = 10, currentPage = 1;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),  //跳过多少条
                'where': {
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/list.ejs', 
            {pageNo:pageNo,pageSize:pageSize,total:total,totalPage:totalPage,projectProgress:result[1],keyword:keyword, project: result[0] });
      }).catch(next);
});

//任务分配（地图）
router.get('/fenfaMap', login.checkin, function (req, res, next) {
    res.render('project/map.ejs');
});

//任务分配（列表）  分配机器
router.get('/fenfaList', login.checkin, function (req, res, next) {
    var projectId = req.query.projectId;
    var countPerPage = 10, currentPage = 1;
    db.Equipment.findAll(
        {
            'limit': countPerPage,                      //每页多少条
            'offset': countPerPage * (currentPage - 1),  //跳过多少条
            'where': {
                workstate: '0',  //空闲
                state:'2'
            }
        }
    ).then(function (result) {
        res.render('project/equipmentList.ejs', { equipment: result, projectId: projectId });
    });
});

router.get('/fenpei', login.checkin, function (req, res, next) {
    var equipmentId = req.query.equipmentId;
    var projectId = req.query.projectId;
    var admin = req.session.admin;
    //分配后就会跳转到任务列表 ，  取出fkeyword、fpageNo、fpageSize
    var fpageSize = req.session.fpageSize;
    var fpageNo = req.session.fpageNo;
    var fkeyword = req.session.fkeyword;
    //拼凑返回值
    var obj = new Object;
    obj.fpageNo = fpageNo;
    obj.fpageSize = fpageSize;
    obj.fkeyword = fkeyword;
    // if(equipmentId != undefined || equipmentId != null){
    //将设备id与该任务管理，并且改任务状态
    //1、判断设备是否已经被分配
    // db.Project.findAll({
    //     'where':{
    //         equipmentId: equipmentId,
    //         '$not': [
    //             { 'progress': '5' }
    //         ]
    //     }
    // }).then(function (result1) {
    //     if(result1!=null && result1.length>0){
    //         obj.isValid = 'no';
    //         res.json(obj);
    //     }else{
    //         //可以分配
    //         var filter = {
    //             equipmentId: equipmentId,
    //             equipmenterId:admin.id,
    //             progress: '4'
        
    //         }
    //         db.Project.update(
    //             filter,
    //             {
    //                 where: {
    //                     id: projectId
    //                 }
    //             }
    //         ).then(function (result) {
    //             obj.result = result;
    //             res.json(obj);
    //         }).catch(next);
    //     }
    // })



        //可以分配
        var filter = {
            equipmentId: equipmentId,
            equipmenterId:admin.id,
            progress: '4'

        }
        db.Project.update(
            filter,
            {
                where: {
                    id: projectId
                }
            }
        ).then(function (result) {
            obj.result = result;
            res.json(obj);
        }).catch(next);
    
});


// router.get('/findByEquiCode', login.checkin, function (req, res, next) {
//     res.render('project/equipProjectList.ejs', { project: null, equipmentCode: '' });
// });


// router.post('/findByEquiCode', login.checkin, function (req, res, next) {
//     var equipmentCode = req.body.equipmentCode;
//     return new Promise((resolve, reject) => {
//         seneca()
//             .client({ port: 8000, type: 'tcp' })
//             .act({ role: 'project', cmd: 'getProject', left: equipmentCode, right: 2 }, (err, result) => {
//                 if (err) {
//                     return console.error(err);
//                 }
//                 else {
//                     // res.json(result);
//                     res.render('project/equipProjectList.ejs', { project: result, equipmentCode: equipmentCode });
//                 }
//             });

//     })
// });


//  任务列表（用于CURD）
router.get('/projectList', login.checkin, function (req, res, next) {
    var keyword = req.query.keyword;
    var adminInfoId = req.session.admin.id;
    var pageNo = req.query.pageNo;
    var pageSize = req.query.pageSize;
    if(keyword ==  undefined || keyword == null){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    // var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1), //跳过多少条
                'where': {
                    equipmentId: null,
                    designId: null,
                    adminInfoId: adminInfoId,
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    equipmentId: null,
                    designId: null,
                    adminInfoId: adminInfoId,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/projectList.ejs', 
            {total:total,totalPage:totalPage,projectProgress:result[1],pageNo:pageNo,pageSize:pageSize, keyword:keyword,project: result[0] });
      }).catch(next);
});

router.post('/projectList', login.checkin, function (req, res, next) {
    var keyword = req.body.keyword;
    var adminInfoId = req.session.admin.id;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    // var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1), //跳过多少条
                'where': {
                    equipmentId: null,
                    designId: null,
                    adminInfoId: adminInfoId,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    equipmentId: null,
                    designId: null,
                    adminInfoId: adminInfoId,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/projectList.ejs', 
            {total:total,totalPage:totalPage,projectProgress:result[1],pageSize:pageSize,pageNo:pageNo, keyword:keyword,project: result[0] });
      }).catch(next);
});

























//  任务列表（用于加盟商任务管理）
router.get('/equipProjectList', login.checkin, function (req, res, next) {
    var keyword = req.query.keyword;
    var equipmentId = req.query.equipmentId;
    var adminInfoId = req.session.admin.id;
    // var countPerPage = 10, currentPage = 1;
    var pageNo = req.query.pageNo;
    var pageSize = req.query.pageSize;
    var filter = {
        // equipmentId: equipmentId,
        '$or': [
            {'name': {
                '$like': '%'+keyword+'%'      
            }},
            {'address': {
                '$like': '%'+keyword+'%'      
            }}
        ]
    }
    if(equipmentId!=undefined && equipmentId !=null && equipmentId !="undefined"){
        filter.equipmentId = equipmentId;
    }
    if(keyword ==  undefined || keyword == null || keyword == "undefined"){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }

    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1), //跳过多少条
                'where': filter
            }
        ),
        db.Equipment.findAll({
            'where': {
                jiameng:adminInfoId
            }
        }),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': filter
            }
        )
        ]).then(function (result) {
        var total = result[3];
        var totalPage = Math.ceil(result[3] / pageSize);
        res.render('project/equipProjectList', {total:total,totalPage:totalPage,pageSize:pageSize,pageNo:pageNo,projectProgress:result[2],project:result[0],equipmentId:equipmentId,keyword:keyword,equipment: result[1]});
    }).catch(next);
});

router.post('/equipProjectList', login.checkin, function (req, res, next) {
    var keyword = req.body.keyword;
    var equipmentId = req.body.equipmentId;
    var adminInfoId = req.session.admin.id;
    var pageNo = req.query.pageNo;
    var pageSize = req.query.pageSize;
    if(keyword ==  undefined || keyword == null || keyword == "undefined"){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }

    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1), //跳过多少条
                'where': {
                    equipmentId: equipmentId,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
                }
            }
        ),
        db.Equipment.findAll({
            'where': {
                jiameng:adminInfoId
            }
        }),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    equipmentId: equipmentId,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ]
                }
            }
        )
        ]).then(function(result){
        var total = result[3];
        var totalPage = Math.ceil(result[3] / pageSize);
        res.render('project/equipProjectList.ejs', 
        {total:total,totalPage:totalPage,pageSize:pageSize,pageNo:pageNo,equipmentId:equipmentId,projectProgress:result[2],equipment:result[1], keyword:keyword,project: result[0] });
      }).catch(next);
});


router.get('/add', login.checkin, function (req, res, next) {
    var projectId = req.query.projectId;
    var admin = req.session.admin;
    var filter = {
        where: {
            id: projectId
        }
    }
    var schemeFilter = {
        where: {
            adminInfoId: admin.id
        }
    }

    Promise.all([
        db.Project.findOne(filter),
        db.Scheme.findAll(schemeFilter)
    ]).then(function (results) {
        res.render('project/add.ejs', { project: results[0], scheme: results[1] });
    }).catch(next);

});

router.post('/addProject', login.checkin, function (req, res, next) {
    var admin = req.session.admin;
    var projectId = req.body.projectId;
    var schemeId = req.body.schemeId;
    var name = req.body.projectName;
    var address = req.body.address;

    if (projectId == undefined || projectId == '') {
        projectId = uuid.v1();
    }

    var project = {
        id: projectId,
        name: name,
        address: address,
        auditstate: '1',
        progress: '1',
        adminInfoId: admin.id,
        schemeId: schemeId
    }

    db.Project.insertOrUpdate(project).then(function (result) {
        res.redirect("/project/projectList");
    }).catch(next);

});

router.get('/delete', login.checkin, function (req, res, next) {
    var projectId = req.query.projectId;
    var filter = {
        where: {
            id: projectId
        }
    }
    db.Project.destroy(filter).then(function (result) {
        res.json(result);
    }).catch(next);
});


router.get('/checkName', function (req, res, next) {
    var projectName = req.query.projectName;
    var oldProjectName = req.query.oldProjectName;
    db.Project.findOne({
        "where":{
            name:projectName
        }
    }).then(function (result) {
        var temp = true;
        if(projectName!=undefined&&projectName == oldProjectName){
            // temp = false;
            res.json(true);
        }else if(result!=null){
            // temp = false;
            res.json(false);
        }else{
            res.json(true);
        }
    }).catch(next);
});


// 待设计的任务列表
router.get('/todoDesign', login.checkin, function (req, res, next) {
    var keyword = req.query.keyword;
    var pageNo = req.query.pageNo;
    var pageSize = req.query.pageSize;
    if(keyword ==  undefined || keyword == null){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    // var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),  //跳过多少条
                'where': {
                    equipmentId: null,
                    designId: null,
                    designerId: null,
                    progress:'1',
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    equipmentId: null,
                    designId: null,
                    designerId: null,
                    progress:'1',
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/todoDesignList.ejs', 
            {total:total,totalPage:totalPage,pageNo:pageNo,pageSize:pageSize,projectProgress:result[1], keyword:keyword,project: result[0] });
        }).catch(next);
});

router.post('/todoDesign', login.checkin, function (req, res, next) {
    var keyword = req.body.keyword;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    // var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),  //跳过多少条
                'where': {
                    equipmentId: null,
                    designId: null,
                    designerId: null,
                    progress:'1',
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    equipmentId: null,
                    designId: null,
                    designerId: null,
                    progress:'1',
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/todoDesignList.ejs', 
            {total:total,totalPage:totalPage,pageNo:pageNo,pageSize:pageSize,projectProgress:result[1], keyword:keyword,project: result[0] });
       }).catch(next);

});





//已接的单
router.get('/designed', login.checkin, function (req, res, next) {
    var keyword = req.query.keyword;
    var designerId = req.session.admin.id;
    var pageNo = req.query.pageNo;
    var pageSize = req.query.pageSize;
    if(keyword ==  undefined || keyword == null){
        keyword = "";
    }
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    // var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),  //跳过多少条
                'where': {
                    // equipmentId: null,
                    // designId: null,
                    designerId: designerId,
                    // progress:'2',
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null },
                        {'progress':'1'}
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    designerId: designerId,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null },
                        {'progress':'1'}
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/designedList.ejs', 
            {total:total,totalPage:totalPage,pageSize:pageSize,pageNo:pageNo,projectProgress:result[1], keyword:keyword,project: result[0]});
      }).catch(next);
});

router.post('/designed', login.checkin, function (req, res, next) {
    var keyword = req.body.keyword;
    var designerId = req.session.admin.id;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;
    if(pageSize ==undefined || pageSize == "" || pageSize == null){
        pageSize = 10;
    }else{
        pageSize = parseInt(pageSize);
    }
    if(pageNo == undefined || pageNo == "" || pageNo == null){
        pageNo = 1;
    }else{
        pageNo = parseInt(pageNo);
    }
    // var countPerPage = 10, currentPage = 1;
    Promise.all([
        db.Project.findAll(
            {
                'limit': pageSize,                      //每页多少条
                'offset': pageSize * (pageNo - 1),  //跳过多少条
                'where': {
                    // equipmentId: null,
                    // designId: null,
                    designerId: designerId,
                    // progress:'2',
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        ),
        db.Dictionary.findAll({
            'where': {
                dicttype:"project_progress"
            }
        }),
        db.Project.count(
            {
                'where': {
                    designerId: designerId,
                    '$or': [
                        {'name': {
                            '$like': '%'+keyword+'%'      
                        }},
                        {'address': {
                            '$like': '%'+keyword+'%'      
                        }}
                    ],
                    '$not': [
                        { 'schemeId': null }
                    ]
                }
            }
        )
        ]).then(function(result){
            var total = result[2];
            var totalPage = Math.ceil(result[2] / pageSize);
            res.render('project/designedList.ejs', 
            {total:total,totalPage:totalPage,pageSize:pageSize,pageNo:pageNo,projectProgress:result[1], keyword:keyword,project: result[0]});
      }).catch(next);

});



//接单操作（这里需要判断是否存在多个接单，还未处理）
router.get('/jiedan', login.checkin, function (req, res, next) {
    var adminId = req.session.admin.id;
    var projectId = req.query.projectId;
    var filter = {
        designerId: adminId,
        progress:'2'
    }
    db.Project.update(
        filter,
        {
            where: {
                id: projectId
            }
        }
    ).then(function (result) {
        res.redirect("/project/todoDesign");
    }).catch(next);
});


router.get('/nojiedan', login.checkin, function (req, res, next) {
    var projectId = req.query.projectId;
    var filter = {
        designerId: null,
        progress:'1'
    }
    db.Project.update(
        filter,
        {
            where: {
                id: projectId
            }
        }
    ).then(function (result) {
        res.redirect("/project/designed");
    }).catch(next);
});

//项目状态接口
router.get('/getProjectState', function (req, res, next) {
    Promise.all([
        db.Sequelize.query("SELECT COUNT(0) as value from project where progress=1" ),
        db.Sequelize.query("SELECT COUNT(0) as value from project where progress=2" ),
        db.Sequelize.query("SELECT COUNT(0) as value from project where progress=3" ),
        db.Sequelize.query("SELECT COUNT(0) as value from project where progress=4" ),
        db.Sequelize.query("SELECT COUNT(0) as value from project where progress=5" ),
        ]).then(function(results){
        var obj = new Object;
        var name = new Array;
        var code = new Array;
        name.push("已开始");
        name.push("已接单");
        name.push("已完成设计");
        name.push("已完成分配");
        name.push("项目已完成");
        var code1= new Object;
        code1.name = "已开始";
        code1.value = results[0][0][0].value;
        code.push(code1);
        var code2 = new Object;
        code2.name = "已接单";
        code2.value = results[1][0][0].value;
        code.push(code2);
        var code3 = new Object;
        code3.name = "已完成设计";
        code3.value = results[2][0][0].value;
        code.push(code3);
        var code4 = new Object;
        code4.name = "已完成分配";
        code4.value = results[3][0][0].value;
        code.push(code4);
        var ccod5 = new Object;
        ccod5.name = "项目已完成";
        ccod5.value = results[4][0][0].value;
        code.push(ccod5);
        obj.name = name;
        obj.code = code;
        res.json(obj);
      }).catch(next);
});


router.get('/getProjectCount', function (req, res, next) {
    var date=new Date;
    var year=date.getFullYear(); 
    var month=date.getMonth()+1;
    var monthsd =(month<10 ? "0"+month:month); 
    var mydate = (year.toString()+"-"+month.toString());
    //获取当月之前的所有月份
    var result = [];
    var str ;
    for(var i = 1; i <= month; i++) {
        if(i<10){ 
            result.push("'"+year.toString() + "-" + "0"+i+"'");
        }else{
            result.push("'"+year.toString() + "-" + i+"'");
        }
    }
    console.log("ss"); //'2017-11','2017-12'

    db.Sequelize.query(
        "SELECT COUNT(0) as num , DATE_FORMAT(created_at,'%Y-%m') as ind from project where DATE_FORMAT(created_at,'%Y-%m') in ("+result+") group by DATE_FORMAT(created_at,'%Y-%m')"
    ).then(function (results) {
        res.json(results[0]);
    }).catch(next);
});

module.exports = router;