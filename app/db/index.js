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

    
    var Company = sequelize.import('../device/models/company.js');
    
    var Design = sequelize.import('../device/models/design.js');
    
    var Equipment = sequelize.import('../device/models/equipment.js');
    
    var Equipmentparameter = sequelize.import('../device/models/equipmentparameter.js');
    
    var Equipmentposition = sequelize.import('../device/models/equipmentposition.js');

    var Factoryversion = sequelize.import('../device/models/factoryversion.js');
    
    var Project = sequelize.import('../device/models/project.js');
    
    //管理员
    var AdminInfo = sequelize.import('../device/models/adminInfo.js');
    //权限
    var Function_ = sequelize.import('../device/models/function.js');
    var Role = sequelize.import('../device/models/role.js');
    //日志
    var Log = sequelize.import('../device/models/log.js');
    var Systemlog = sequelize.import('../device/models/systemlog.js');



    //数据字典
    var Dictionary = sequelize.import('../device/models/dictionary.js');
    //省市区
    var County = sequelize.import('../device/models/county.js');
    var City = sequelize.import('../device/models/city.js');
    var Province = sequelize.import('../device/models/province.js');
    var Scheme = sequelize.import('../device/models/scheme.js');


    Equipment.hasOne(Equipmentparameter);
    Equipmentparameter.belongsTo(Equipment);

    Equipment.hasOne(Equipmentposition);
    Equipmentposition.belongsTo(Equipment);

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
    exports.Equipmentposition = Equipmentposition;
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
