'use strict';

var Sequelize = require('sequelize');
var Sequelize2 = require('sequelize');

//��ʼ����ǰ���ݿ���Ϣ
exports.initdevice = function () {

    var sequelize = new Sequelize('cdoapple', 'test', 'test',
        {
            host: '127.0.0.1',
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

exports.initmaterial = function () {

    var sequelize = new Sequelize('cdomaterial', 'test', 'test',
        {
            host: '127.0.0.1',//192.168.31.108
            port: 3306,
            dialect: 'mysql',
            logging: console.log,
            //东八时区
            timezone: '+08:00'
        }
    );

    
    var House = sequelize.import('../material/models/house.js');
    var Houseplan = sequelize.import('../material/models/houseplan.js');
    var Designpackge = sequelize.import('../material/models/designpackge.js');

    var Supplybook = sequelize.import('../material/models/supplybook.js');
    var Supply = sequelize.import('../material/models/supply.js');
    var Purchase = sequelize.import('../material/models/purchase.js');
    var Materialcategory = sequelize.import('../material/models/materialcategory.js');
    var Material = sequelize.import('../material/models/material.js');
    var Calculation = sequelize.import('../material/models/calculation.js');
    var Deliver = sequelize.import('../material/models/deliver.js'); 

    House.hasOne(Houseplan);
    Houseplan.belongsTo(House);

    Houseplan.hasOne(Designpackge);
    Designpackge.belongsTo(Houseplan);

    Materialcategory.hasOne(Material);
    Material.belongsTo(Materialcategory);

    Material.hasOne(Purchase);
    Purchase.belongsTo(Material);

    Material.hasOne(Calculation);
    Calculation.belongsTo(Material);

    Purchase.hasOne(Deliver);
    Deliver.belongsTo(Purchase); 

    Supplybook.hasMany(Supply, { foreignKey: 'supplybook_id', targetKey: 'id', as: 'Supplys' });
    Material.hasMany(Supply, { foreignKey: 'material_id', targetKey: 'id', as: 'Supplys' });


    // Materialcategory.hasMany(Material, { foreignKey: 'category_id', targetKey: 'id', as: 'Materials' });

    sequelize.sync();
    
    exports.Sequelize2 = sequelize;


    exports.House = House;
    exports.Houseplan = Houseplan;
    exports.Designpackge = Designpackge;
    exports.Supplybook = Supplybook;
    exports.Supply = Supply;
    exports.Purchase = Purchase;
    exports.Materialcategory = Materialcategory;
    exports.Material = Material;
    exports.Calculation = Calculation;
    exports.Deliver = Deliver; 

}