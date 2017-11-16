var express = require('express');
var login = require('./login');
var router = express.Router();
var uuid = require('node-uuid');
const db = require("../db/");
var multer  = require('multer');
var fs = require('fs');

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './upload/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now());  
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

// //设备列表
// router.get('/list', login.checkin, function (req, res, next) {
//         var countPerPage = 10, currentPage = 1;
//         db.Equipment.findAll(
//             {
//                 'limit': countPerPage,                      //每页多少条
//                 'offset': countPerPage * (currentPage - 1)  //跳过多少条
//             }
//         ).then(function (result) {
//             res.render('equipment/list.ejs', { equipment: result });
//         });
//     });


// router.get('/add', login.checkin, function (req, res, next) {
//     var equipmentId = req.query.equipmentId;
//     var filter = {
//         where: {
//             id:equipmentId
//         }
//     }
//     db.Equipment.findOne(filter).then(function (result) {
//         res.render('equipment/add.ejs', { equipment: result });
//     }).catch(next);
// });

// router.post('/addEquipment', login.checkin, function (req, res, next) {
//     var admin = req.session.admin;
//     var equipmentId = req.body.equipmentId;
//     var name = req.body.name;
//     var code = req.body.code;
//     var priority = req.body.priority;
//     var warrantyperiod = req.body.warrantyperiod;
//     var customer = req.body.customer;
//     var state = req.body.state;
//     var workstate = req.body.workstate;
//     var buytime = req.body.buytime;

//     if(equipmentId == undefined || equipmentId == ''){
//         equipmentId = uuid.v1();
//     }

//     var equipment = {
//         id:equipmentId,
//         name:name,
//         // adminInfoId:admin.id,
//         code:code,
//         // uploadtime:new Date(),
//         state:state,
//         priority:priority,
//         warrantyperiod:warrantyperiod,
//         customer:customer,
//         workstate:workstate,
//         buytime:buytime
//     }

//     db.Equipment.insertOrUpdate(equipment).then(function (result) {
//         res.redirect("/equipment/list");
//     }).catch(next);
        
//     });

// router.get('/delete', login.checkin, function (req, res, next) {
//     var equipmentId = req.query.equipmentId;
//     if(equipmentId != undefined || equipmentId != null){
//         var filter = {
//             where: {
//                 id:equipmentId
//             }
//         }
//         db.Equipment.destroy(filter).then(function (result) {
//             res.json(result);
//         }).catch(next);
//     }
// });


//获取设计详细信息
router.get('/findById', login.checkin, function (req, res, next) {
    var designId = req.query.designId;
    db.Design.findById(designId).then(function (result) {
        res.render('design/info.ejs',{ design: result ,moment: require("moment")});
    }).catch(next);
});

router.get('/download', function (req, res,next) {
    var designId = req.query.designId;
    db.Design.findById(designId).then(function (result) {
        res.download(result.path);
    }).catch(next);
    // res.download('upload/logo-1508833808696.png');
  });

  router.get('/add', function (req, res,next) {
    var projectId = req.query.projectId;
    res.render('design/add.ejs',{ projectId: projectId });
  });

  
  router.post('/save',upload.single('file1'), function (req, res,next) {
    var admin = req.session.admin;
    var projectId = req.body.projectId;
    var name = req.body.name;

    //图片上传
    var file = req.file;

    //以下代码得到文件后缀
    var name = file.originalname;
    var nameArray = name.split('');
    var nameMime = [];
    var l = nameArray.pop();
    nameMime.unshift(l);
    while (nameArray.length != 0 && l != '.') {
        l = nameArray.pop();
        nameMime.unshift(l);
    }
    //Mime是文件的后缀
    var Mime = nameMime.join('');
    console.log(Mime);
    fs.renameSync('./upload/'+file.filename,'./upload/'+file.filename+Mime);
    console.log('./upload/'+file.filename+Mime);
    // 图片路劲
    var path = 'upload/'+file.filename+Mime;

    var design = {
        id:uuid.v1(),
        adminInfoId:admin.id,
        name:name,
        path:path,
        uploadtime: new Date(),
        confirmtime:new Date(),
        state:1
    };

    db.Design.create(design).then(function (result) {
        if(result!=null){
            //上传成功，并且和任务关联
            db.Project.update(
                {
                    designerId:admin.id,
                    designId:result.id
                }
                ,
                {
                    where: {
                        id:projectId
                    }
                }
            ).then(function (result) {
                res.write("上传成功，并且关联成功！");
                res.end();
            }).catch(next);
        }
    }).catch(next);
  });
  

module.exports = router;