'use strict';

var Sequelize = require('sequelize');

//��ʼ����ǰ���ݿ���Ϣ
exports.init = function () {

    var sequelize = new Sequelize('cdolute', 'test', 'test',
        {
            host: 'localhost',
            port: 3306,
            dialect: 'mysql',
            logging: console.log,
            //东八时区
            timezone: '+08:00'
        }
    );

    //��ʼ���û���
    var User = sequelize.import('../models/user.js');
    //����Ա�û�
    //var Manager = sequelize.import('../models/manager.js');
    //��ǰ����Ŀ��Ϣ
    //var Project = sequelize.import('../models/project.js');
    //��ʼ���û���Ϣ��
    var UserInfo = sequelize.import('../models/userInfo.js');
    //�û��Ľ�ɫ��
    var Role = sequelize.import('../models/role.js');
    //搜索历史
    var HistorySearch = sequelize.import('../models/historySearch.js');
    //楼盘
    var Building = sequelize.import('../models/building.js');
    //户型
    var ApartmentLayout = sequelize.import('../models/apartmentLayout.js');
    //产品
    var Product = sequelize.import('../models/product.js');
    //产品对应的全景图、平面图
    var Panorama = sequelize.import('../models/panorama.js');
    var Photo = sequelize.import('../models/photo.js');
    //评论
    var Comment_ = sequelize.import('../models/comment.js');
    //订单
    var Order = sequelize.import('../models/order.js');
    //订单施工图
    var Constructplans = sequelize.import('../models/constructplans.js');
    //项目施工过程信息
    var Constructrecord = sequelize.import('../models/constructrecord.js');
    //管理员
    var AdminInfo = sequelize.import('../models/adminInfo.js');
    //权限
    var Function_ = sequelize.import('../models/function.js');
    //日志
    var Log = sequelize.import('../models/log.js');
    //数据字典
    var Dictionary = sequelize.import('../models/dictionary.js');
    //省市区
    var County = sequelize.import('../models/county.js');
    var City = sequelize.import('../models/city.js');
    var Province = sequelize.import('../models/province.js');
    //广告
    var Ad = sequelize.import('../models/ad.js');


    //user与userInfo的关联关系
    User.hasOne(UserInfo);
    UserInfo.belongsTo(User);
    //role与user的关联关系
    //Role.hasMany(User, { foreignKey: 'role_id', targetKey: 'id', as: 'Users' });
    //HistorySearch与User、Building的关联
    User.hasMany(HistorySearch, { foreignKey: 'user_id', targetKey: 'id', as: 'HistorySearchs' });
    Building.hasMany(HistorySearch, { foreignKey: 'building_id', targetKey: 'id', as: 'HistorySearchs' });
    //apartmentLayout与Building的关联
    Building.hasMany(ApartmentLayout, { foreignKey: 'building_id', targetKey: 'id', as: 'ApartmentLayouts' });
    //ApartmentLayout  与 Product 关联
    ApartmentLayout.hasMany(Product, { foreignKey: 'apartmentLayout_id', targetKey: 'id', as: 'Products' });
    //Product与Panorama、Photo的关联
    Product.hasMany(Panorama, { foreignKey: 'product_id', targetKey: 'id', as: 'Panoramas' });
    Product.hasMany(Photo, { foreignKey: 'product_id', targetKey: 'id', as: 'Photos' });
    //order与comment的关联
    Order.hasMany(Comment_, { foreignKey: 'order_id', targetKey: 'id', as: 'Comments' });
    //product与comment的关联
    Product.hasMany(Comment_, { foreignKey: 'product_id', targetKey: 'id', as: 'Comments' });
    User.hasMany(Comment_, { foreignKey: 'user_id', targetKey: 'id', as: 'Comments' });
    //Order与Constructplans的关联
    Order.hasMany(Constructplans, { foreignKey: 'order_id', targetKey: 'id', as: 'Constructplans' });
    Order.hasMany(Constructrecord, { foreignKey: 'order_id', targetKey: 'id', as: 'Constructrecords' });

    //Product与order的关联
    Product.hasMany(Order, { foreignKey: 'product_id', targetKey: 'id', as: 'Orders' });
    //user与order的关联
    User.hasMany(Order, { foreignKey: 'user_id', targetKey: 'id', as: 'Orders' });
    //adminInfo与order的关联
    //AdminInfo.hasMany(Order, { foreignKey: 'adminInfo_id', targetKey: 'id', as: 'Orders' });
    //adminInfo与role的关联
    Role.hasMany(AdminInfo, { foreignKey: 'role_id', targetKey: 'id', as: 'AdminInfos' });
    //adminInfo与log的关联
    Log.hasMany(AdminInfo, { foreignKey: 'role_id', targetKey: 'id', as: 'AdminInfos' });
    // 角色与权限的关联
    Role.belongsToMany(Function_, { through: 'roleFunctions', as: 'roleFunctions' });
    Function_.belongsToMany(Role, { through: 'roleFunctions', as: 'roleFunctions' });


    // �Ƴ�����
    sequelize.sync();

    exports.Sequelize = sequelize;
    exports.User = User;
    // exports.Manager = Manager;
    exports.UserInfo = UserInfo;
    exports.Role = Role;
    exports.HistorySearch = HistorySearch;
    exports.Building = Building;
    exports.ApartmentLayout = ApartmentLayout;
    exports.Product = Product;
    exports.Panorama = Panorama;
    exports.Photo = Photo;
    exports.Constructplans = Constructplans;
    exports.Constructrecord = Constructrecord;
    exports.Order = Order;
    exports.Comment_ = Comment_;

    exports.AdminInfo = AdminInfo;
    exports.Function_ = Function_;
    exports.Log = Log;
    exports.Dictionary = Dictionary;
    exports.Ad = Ad;


    exports.Province = Province;
    exports.County = County;
    exports.City = City;
    // exports.Project = Project;
}
