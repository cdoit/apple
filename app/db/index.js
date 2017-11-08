'use strict';

var Sequelize = require('sequelize');

//��ʼ����ǰ���ݿ���Ϣ
exports.init = function () {

    var sequelize = new Sequelize('cdoapple', 'test', 'test',
        {
            host: 'localhost',
            port: 3306,
            dialect: 'mysql',
            logging: console.log,
            //东八时区
            timezone: '+08:00'
        }
    );

    
    var Company = sequelize.import('../models/company.js');
    
    var Design = sequelize.import('../models/design.js');
    
    var Equipment = sequelize.import('../models/equipment.js');
    
    var Equipmentparameter = sequelize.import('../models/equipmentparameter.js');
    
    // var Equipmentposition = sequelize.import('../models/equipmentposition.js');

    var Factoryversion = sequelize.import('../models/factoryversion.js');
    
    var Project = sequelize.import('../models/project.js');
    
    //管理员
    var AdminInfo = sequelize.import('../models/adminInfo.js');
    //权限
    var Function_ = sequelize.import('../models/function.js');
    var Role = sequelize.import('../models/role.js');
    //日志
    var Log = sequelize.import('../models/log.js');
    var Systemlog = sequelize.import('../models/systemlog.js');



    //数据字典
    var Dictionary = sequelize.import('../models/dictionary.js');
    //省市区
    var County = sequelize.import('../models/county.js');
    var City = sequelize.import('../models/city.js');
    var Province = sequelize.import('../models/province.js');
    var Scheme = sequelize.import('../models/scheme.js');


    Equipment.hasOne(Equipmentparameter);
    Equipmentparameter.belongsTo(Equipment);

    // Equipment.hasOne(Equipmentposition);
    // Equipmentposition.belongsTo(Equipment);

    Equipment.hasOne(Factoryversion);
    Factoryversion.belongsTo(Equipment);

    
    //adminInfo与role的关联
    Role.hasMany(AdminInfo, { foreignKey: 'role_id', targetKey: 'id', as: 'AdminInfos' });
    //adminInfo与log的关联
    AdminInfo.hasMany(Log, { foreignKey: 'admin_id', targetKey: 'id', as: 'Logs' });
    Company.hasMany(AdminInfo, { foreignKey: 'company_id', targetKey: 'id', as: 'AdminInfos' });
    // 角色与权限的关联
    Role.belongsToMany(Function_, { through: 'roleFunctions', as: 'roleFunctions' });
    Function_.belongsToMany(Role, { through: 'roleFunctions', as: 'roleFunctions' });


    // �Ƴ�����
    sequelize.sync();

    exports.Sequelize = sequelize;

    
    exports.Company = Company;
    exports.Design = Design;
    exports.Role = Role;
    exports.Equipment = Equipment;
    exports.Equipmentparameter = Equipmentparameter;
    // exports.Equipmentposition = Equipmentposition;
    exports.Factoryversion = Factoryversion;
    exports.Project = Project;

    exports.AdminInfo = AdminInfo;
    exports.Function_ = Function_;
    exports.Log = Log;
    exports.Dictionary = Dictionary;
    exports.Systemlog = Systemlog;
    exports.Scheme = Scheme;


    exports.Province = Province;
    exports.County = County;
    exports.City = City;
    // exports.Project = Project;
}
