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

var uploadFolder = './public/upload/';

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
    var designName = req.body.designName;

    //图片上传
    var file = req.file;

    //以下代码得到文件后缀
    var name = file.originalname;
    var size = file.size;
    console.log('文件大小：%s', file.size);
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
    fs.renameSync('./public/upload/'+file.filename,'./public/upload/'+file.filename+Mime);
    console.log('./public/upload/'+file.filename+Mime);
    // 图片路劲
    var path = 'public/upload/'+file.filename+Mime;

    var design = {
        id:uuid.v1(),
        adminInfoId:admin.id,
        name:designName,
        path:path,
        uploadtime: new Date(),
        confirmtime:new Date(),
        state:1,
        size:size
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